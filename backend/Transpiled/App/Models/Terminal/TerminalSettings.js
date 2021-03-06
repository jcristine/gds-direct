const AgentCustomSettings = require('../../../../Repositories/AgentCustomSettings.js');
const Db = require('./../../../../Utils/Db.js');
const {array_map, array_flip, array_intersect_key, empty, json_decode, str_split, intval, isset} = require('klesun-node-tools/src/Transpiled/php.js');
const RedisData = require("../../../../LibWrappers/RedisData.js");
const AreaSettings = require("../../../../Repositories/AreaSettings");
const GdsSessions = require("../../../../Repositories/GdsSessions");

const TABLE = 'terminalSettings';

const self = {
	TABLE: TABLE,
	CACHE_KEY_SETTINGS: 'cmsTerminalAgentSettings_',
	CACHE_KEY_CURRENT_GDS_ID: 'cmsTerminalAgentCurrentGdsId_',
	addUpdateRow: (fields) => Db.with(db => db.writeRows(TABLE, [fields])),
	$fields: [
		'id',
		'agentId',
		'gds',
		'language',
		'terminalNumber',
		'fontSize',
		'canCreatePq',
		'keyBindings',
		'terminalTheme',
		'matrixConfiguration',
	],
	$default: {
		currentGds: 'apollo',
		language: 'apollo',
		area: 'A',
		terminalNumber: 1,
		fontSize: 1,
		canCreatePq: 0,
		terminalTheme: 4,
	},
};

class TerminalSettings {
	/** @param {IEmcResult} emcResult */
	constructor(emcResult) {
		this.agentId = emcResult.user.id;
		this.currentGdsStore = RedisData.stores.currentGds([emcResult.user.id]);
	}

	getCurrentGds() {
		const fallback = this.getDefault('currentGds');
		return this.currentGdsStore.get()
			.then(gds => gds || fallback);
	}

	/**
	 * @param null|string $name
	 * @return array|string
	 */
	getDefault($name) {
		if ($name) {
			return self.$default[$name];
		}
		return self.$default;
	}

	static getForcedStartPcc(gds, area) {
		if (gds === 'sabre' && area === 'A') {
			// ensure we are emulated in 6IIF on startup
			return '6IIF';
		} else if (gds === 'apollo' && area !== 'A') {
			// A is emulated to 2F3K at once, other areas need explicit emulation to not
			// receive "AG - DUTY CODE NOT AUTH FOR CRT - APOLLO" error on every command
			return '2F3K';
		} else if (gds === 'apollo' && area !== 'A') {
			// same reason as in Apollo
			return '711M';
		} else {
			return null;
		}
	}

	_transformRowFromDb($row, areaRows) {
		return {
			language: $row['language'],
			terminalNumber: intval($row['terminalNumber']),
			keyBindings: json_decode($row['keyBindings']),
			fontSize: intval($row['fontSize']),
			theme: intval($row['terminalTheme']),
			areaSettings: areaRows
				.filter(areaRow => areaRow.gds === $row['gds'])
				.map(areaRow => {
					const defaultPcc = areaRow.defaultPcc ||
						this.constructor.getForcedStartPcc(areaRow.gds, areaRow.area) ||
						GdsSessions.makeDefaultAreaState(areaRow.gds).pcc;
					return {...areaRow, defaultPcc};
				}),
			matrix: json_decode($row['matrixConfiguration']),
		};
	}

	/**
	 * Get setting by Agent
	 *
	 * @param int $agentId
	 */
	async getSettings() {
		const $agentId = this.agentId;
		const agentCustomSettings = await AgentCustomSettings
			.getMapping($agentId).catch(exc => ({}));
		const $settings = {
			agentCustomSettings: agentCustomSettings,
			common: {currentGds: await this.getCurrentGds()},
			gds: {},
		};
		for (const $gds of ['apollo', 'sabre', 'galileo', 'amadeus']) {
			$settings['gds'][$gds] = this.getDefault();
		}
		return Db.with(
			db => db.fetchAll({
				table: TABLE,
				where: [['agentId', '=', $agentId]],
			}).then($result => AreaSettings.getByAgent($agentId, db)
				.then(areaRows => {
					for (const $row of $result) {
						if (isset($settings['gds'][$row['gds']])) {
							$settings['gds'][$row['gds']] = this._transformRowFromDb($row, areaRows);
						}
					}
					return $settings;
				})),
		);
	}

	/**
	 * Add gds settings if not exist
	 *
	 * @param string $gds
	 * @throws \Dyninno\Core\Exception\SQLException
	 * @throws \Psr\SimpleCache\InvalidArgumentException
	 */
	addGds($gds) {
		const agentId = this.agentId;
		// just to be safe, it's how it worked in CMS
		this.currentGdsStore.get().then(current =>
			this.currentGdsStore.set(current || $gds));
		return Db.with(
			(db) => db.writeRows(TABLE, [{
				agentId: agentId,
				gds: $gds,
			}]),
		);
	}

	/**
	 * Set current gds
	 *
	 * @param string $gds
	 */
	setCurrentGds($gds) {
		return this.currentGdsStore.set($gds);
	}

	/**
	 * Save setting
	 *
	 * @param string $gds
	 * @param string $field
	 * @param string $value
	 */
	setSetting($gds, $field, $value) {
		this.addGds($gds);
		return self.addUpdateRow({agentId: this.agentId, gds: $gds, [$field]: $value});
	}

	/**
	 * Save settings
	 *
	 * @param string $gds
	 * @param array $data
	 */
	setSettings($gds, $data) {
		const agentId = this.agentId;
		const filtered = array_intersect_key($data, array_flip(self.$fields));
		return empty(filtered)
			? Promise.reject('Empty/unknown setting values - ' + Object.keys($data).join(', '))
			: Db.with(db => db.writeRows(TABLE, [Object.assign({}, filtered, {
				agentId: agentId, gds: $gds,
			})]));
	}

	setAreaSettings($gds, $areaSettings) {
		return AreaSettings.update(this.agentId, $gds, $areaSettings);
	}
}

module.exports = TerminalSettings;
