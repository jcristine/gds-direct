// namespace Rbs\GdsDirect\CmdLog;

const GdsDirect = require('../../../Rbs/GdsDirect/GdsDirect.js');
const SessionStateHelper = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper.js');
const SessionStateProcessor = require('../../../Rbs/GdsDirect/SessionStateProcessor/SessionStateProcessor.js');
const DbCmdLog = require("./DbCmdLog");

/**
 * creating this class primarily for tests
 * it is same thing as TerminalCommandLog+php, but it does not read from DB
 */
class InstanceCmdLog {

	constructor($cmdRows, fullState, session) {
		this.$leadData = {};
		this.$cmdRequested = '';
		this.$dialect = '';

		this.fullState = fullState;
		this.session = session;
		this.$sessionId = session['id'] || null;
		this.$gds = session.context['gds'] || null;
		this.$cmdRows = $cmdRows;
	}

	setCmdRequested($cmdRequested, $dialect) {
		this.$cmdRequested = $cmdRequested;
		this.$dialect = $dialect;
		return this;
	}

	setLeadData($leadData) {
		this.$leadData = $leadData;
		return this;
	}

	getAreaData($letter) {
		return this.$letterToArea[$letter] || {
			'pcc': null,
			'record_locator': null,
			'has_pnr': false,
			'is_pnr_stored': false,

			'internal_token': this.getSessionData()['internal_token'] || null,
			'session_id': this.getSessionData()['id'] || null,
			'work_area_letter': $letter,
		};
	}

	getAreaRows() {
		return php.array_values(this.$letterToArea);
	}

	makeRow($cmdData) {
		let $prevState, $rqCnt;
		$prevState = this.fullState.areas[this.fullState.area];
		return {
			'cmd_requested': this.$cmdRequested,
			'dialect': this.$dialect,
			'cmd_performed': $cmdData['cmd_performed'],
			'cmd_type': $cmdData['cmd_type'],
			'duration': $cmdData['duration'],
			'gds': this.$gds,
			'session_id': this.$sessionId,
			'area': this.fullState['area'],
			'dt': php.date('Y-m-d H:i:s'),
			'lead_id': this.$leadData['leadId'] || null,
			'output': $cmdData['output'],

			// session state before this command was called
			'pcc': $prevState['pcc'],
			'record_locator': $prevState['record_locator'],
			'can_create_pq': $prevState['can_create_pq'],
			'pricing_cmd': $prevState['pricing_cmd'],
			'has_pnr': $prevState['has_pnr'],
			'is_pnr_stored': $prevState['is_pnr_stored'],
		};
	}

	logCommand($cmd, whenOutput) {
		let startMs = Date.now();
		whenOutput.then($output => {
			let $cmdParsed = GdsDirect.makeGdsInterface(this.$gds).parseCommand($cmd);
			let $loggedType = $cmdParsed['followingCommands'] ? 'complexCmd' : $cmdParsed['type'];
			let $row = this.makeRow({
				'cmd_performed': $cmd,
				'cmd_type': $loggedType,
				'duration': ((Date.now() - startMs) / 1000).toFixed(3),
				'output': $output,
			});
			$row['id'] = null;
			this.$cmdRows.push($row);
			this.fullState = SessionStateProcessor.updateFullState(cmd, output, this.$gds, this.fullState);
		});
	}

	updateAreaState($areaData, $rqData) {
		let $row;
		$row = this.makeRow({
			'cmd_type': $rqData['type'],
			'duration': $rqData['duration'],
			'cmd_performed': '', 'output': '',
		});
		$row['id'] = null;
		this.$cmdRows.push($row);
		this.fullState = SessionStateHelper.updateFromArea(this.getSessionData(), $areaData);
		this.fullState.areas[this.fullState.area] = this.fullState;
	}

	/** @return array like Db::fetchOne('SELECT * FROM terminal_sessions') */
	getSessionData() {
		return this.fullState;
	}

	/** @return array like Db::fetchAll('SELECT * FROM terminal_command_log') */
	getLastStateSafeCommands() {
		return DbCmdLog.takeStateSafeCommands(this.$cmdRows, this.fullState['area'])['commands'];
	}

	getLastCommandsOfTypes($types) {
		return DbCmdLog.takeLastCommandsOfTypes(this.$cmdRows, this.fullState['area'], $types)['commands'];
	}

	/** @return array like Db::fetchAll('SELECT * FROM terminal_command_log') */
	getCurrentPnrCommands() {
		return DbCmdLog.takePnrCommands(this.$cmdRows, this.fullState)['commands'];
	}

	/** @return array like Db::fetchAll('SELECT * FROM terminal_command_log') */
	getAllCommands() {
		return this.$cmdRows;
	}

	/** @return array like Db::fetchOne('SELECT * FROM terminal_command_log') */
	getLastCalledCommand() {
		return this.$cmdRows.slice(-1)[0];
	}

	/** not mandatory for a DB-less process */
	storeCommandsToDb() {
		let $startIndex, $i, $row, $id;
		$startIndex = 0;
		for ($i = php.count(this.$cmdRows); $i >= 0; ++$i) {
			if (!php.isset(this.$cmdRows[$i]['id'])) {
				$startIndex = $i;
			} else {
				break;
			}
		}
		for ($i = $startIndex; $i < php.count(this.$cmdRows); ++$i) {
			$row = this.$cmdRows[$i];
			$id = Db.inst().insert('terminal_command_log', $row).getConnection().lastInsertId();
			this.$cmdRows[$i]['id'] = $id;
		}
		return this;
	}
}

module.exports = InstanceCmdLog;
