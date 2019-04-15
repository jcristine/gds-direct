
const {boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.js');
const TerminalSettings = require('../../App/Models/Terminal/TerminalSettings.js');

class TerminalBaseController {

	// original php constructor params
	// $terminalService;
	// $requestGeoRepository;
	// $terminalBufferingRepository;
	// $requestAssignHistoryRepository;
	// $rbsService;
	// $flightOptionGeo;
	// $baggageAdapterService;

	/** @param {IEmcResult} emcResult */
	constructor(emcResult) {
		this.emcResult = emcResult;
	}

	/**
	 * @param $name
	 * @param $currentGds
	 * @param $value
	 */
	saveSettingAction($name, $currentGds, $value) {
		let saving;
		let agentSettings = new TerminalSettings(this.emcResult);
		switch ($name) {
			case 'gds':
				saving = agentSettings.setCurrentGds($value);
				break;
			case 'language':
				saving = agentSettings.setSetting($currentGds, 'language', $value);
				break;
			case 'terminal':
				saving = agentSettings.setSetting($currentGds, 'terminalNumber', $value);
				break;
			case 'fontSize':
				saving = agentSettings.setSetting($currentGds, 'fontSize', $value);
				break;
			case 'theme':
				saving = agentSettings.setSetting($currentGds, 'terminalTheme', $value);
				break;
			default:
				saving = Promise.reject('Cant save settings. Unknown key - ' + $name);
				break;
		}
		// TODO: should fix - frontend takes userMessages from data.userMessages instead of data.data.userMessages
		return saving
			.then(sqlResult => ({success: true, data: {data: {userMessages: ['Ok writing ' + $name]}}}))
			.catch(exc => ({success: false, data: {userMessages: ['Failure - ' + exc]}}));
	}

	/**
	 * @param Request $request
	 * @param string $name
	 * @param string $currentGds
	 */
	postSaveSettingAction($value, $name, $currentGds) {
		let agentSettings = new TerminalSettings(this.emcResult);
		let saving;
		switch ($name) {
			case 'settings':
				let promises = [];
				for (let [$gds, $data] of Object.entries($value)) {
					// initial code did not consider that $_POST may have other fields...
					if (!['apollo', 'sabre', 'amadeus', 'galileo'].includes($gds)) {
						continue;
					}
					promises.push(agentSettings.setSettings($gds, {
						'keyBindings': $data['keyBindings'] == '' ? ''
							: json_encode($data['keyBindings']),
					}));
					let $areaSettings = $data['areaSettings'] || [];
					promises.push(agentSettings.setAreaSettings($gds, $areaSettings));
				}
				saving = Promise.all(promises);
				break;
			case 'matrixConfiguration':
				// make sure int numbers are not strings
				$value = {
					hasWide: $value.hasWide,
					matrix: {
						rows: +$value.matrix.rows,
						cells: +$value.matrix.cells,
						list: $value.matrix.list.map(num => +num),
					},
				};
				let $configuration = json_encode($value);
				saving = agentSettings.setSetting($currentGds, 'matrixConfiguration', $configuration);
				break;
			default:
				saving = Promise.reject('Cant save settings. Unknown key - ' + $name);
				break;
		}
		return saving.then(sqlResult => ({success: true}));
	}
}

module.exports = TerminalBaseController;