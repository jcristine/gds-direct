const CommonDataHelper = require('../../Transpiled/Rbs/GdsDirect/CommonDataHelper.js');
const WorkAreaScreenParser = require('../../Transpiled/Gds/Parsers/Amadeus/WorkAreaScreenParser.js');
const GdsProfiles = require('../../Repositories/GdsProfiles.js');
const AmadeusClient = require('../../GdsClients/AmadeusClient.js');
const GdsSessions = require('../../Repositories/GdsSessions.js');
const ArrayUtil = require('../../Transpiled/Lib/Utils/ArrayUtil.js');
const Errors = require('../../Transpiled/Rbs/GdsDirect/Errors.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const StringUtil = require('../../Transpiled/Lib/Utils/StringUtil.js');
const Fp = require('../../Transpiled/Lib/Utils/Fp.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

// defines how much areas can agent open in single session
const AREA_LETTERS = GdsSessions.getAreaLetters('amadeus');

const forgeViewAreasDump = (sessionData, areasFromDb) => {
	const areas = [];
	for (const area of Object.values(areasFromDb)) {
		areas[area['area']] = area;
	}
	const lines = [
		'00000000         ' + sessionData.pcc,
		'',
		'AREA  TM  MOD SG/DT.LG TIME      ACT.Q   STATUS     NAME',
	];
	for (const letter of Object.values(AREA_LETTERS)) {
		if (php.isset(areas[letter])) {
			let status;
			if (areas[letter]['isPnrStored']) {
				status = 'PNR MODIFY';
			} else if (areas[letter]['hasPnr']) {
				status = 'PNR CREATE';
			} else {
				status = 'SIGNED';
			}
			const data = {
				letter: letter,
				signed: (letter == sessionData['area']) ? '-IN' : '   ',
				status: status,
			};
			lines.push(StringUtil.format('{letter}{signed}      PRD WS/SU.EN  24             {status}', data));
		} else {
			lines.push(letter + '                                      NOT SIGNED');
		}
	}
	return php.implode(php.PHP_EOL, lines);
};

const formatGtlPccError = ($exc, pcc) => {
	const prefix = 'Failed to start session with PCC ' + pcc + ' - ';
	if (php.preg_match(/\bSoapFault: *11|\Session\b/, ($exc.message || ''))) {
		return Rej.BadRequest('Invalid PCC');
	} else {
		return Rej.UnprocessableEntity(prefix + 'Unexpected GTL error - ' + php.preg_replace(/\s+/, ' ', php.substr($exc.message || '', -100)));
	}
};

/**
 * Amadeus guys did not enable PCC emulation and area change functionality
 * for our account saying something like it being "legacy" and stuff, so we
 * had to implement it on our own for compatibility with other GDS-es
 */
const FakeAreaUtil = ({
	stateful, amadeus = AmadeusClient.makeCustom(),
}) => {
	const startNewAreaSession = async (area, pcc = null) => {
		const row = GdsSessions.makeDefaultAreaState('amadeus');
		pcc = pcc || row.pcc;
		row.area = area;
		row.pcc = pcc;
		row.gdsData = await amadeus.startSession({
			profileName: GdsProfiles.chooseAmaProfile(row.pcc),
			pcc: pcc,
		});
		return row;
	};

	const updateGdsData = async (newAreaState) => {
		const fullState = stateful.getFullState();
		fullState.areas[newAreaState.area] = newAreaState;
		fullState.area = newAreaState.area;
		const updated = await Promise.all([
			stateful.updateFullState(fullState),
			stateful.updateGdsData(newAreaState.gdsData),
		]);
		return updated;
	};

	const changePcc = async (pcc) => {
		const calledCommands = [];

		if (stateful.getSessionData().pcc === pcc) {
			const msg = Errors.getMessage(Errors.ALREADY_IN_THIS_PCC, {pcc});
			return Rej.BadRequest(msg);
		}
		// check that there is no PNR in session to match GDS behaviour
		if (stateful.getSessionData().hasPnr) {
			const msg = Errors.getMessage(Errors.LEAVE_PNR_CONTEXT, {pcc});
			return Rej.BadRequest(msg);
		}
		await CommonDataHelper.checkEmulatePccRights({stateful, pcc});

		const areaState = await startNewAreaSession(stateful.getSessionData().area, pcc)
			.catch(exc => formatGtlPccError(exc, pcc));

		areaState.cmdCnt = 1; // to not trigger default area PCC fallback later

		// sometimes when you request invalid PCC, Amadeus fallbacks to
		// SFO1S2195 - should call >JD; and check that PCC is what we requested
		const jdCmdRec = await amadeus.runCmd({command: 'JD'}, areaState.gdsData);
		const jdDump = jdCmdRec.output;
		const parsed = WorkAreaScreenParser.parse(jdDump);
		if (parsed.pcc !== pcc) {
			amadeus.closeSession(areaState.gdsData);
			const msg = 'Failed to change PCC - resulting PCC ' + parsed.pcc + ' does not match requested PCC ' + pcc;
			return Rej.UnprocessableEntity(msg, {jdDump});
		}

		const oldGdsData = stateful.getGdsData();
		await updateGdsData(areaState);
		amadeus.closeSession(oldGdsData);

		return {
			calledCommands: calledCommands,
			userMessages: ['Successfully changed PCC to ' + pcc],
		};
	};

	const changeArea = async (area) => {
		if (!php.in_array(area, AREA_LETTERS)) {
			const errorData = {area, options: php.implode(', ', AREA_LETTERS)};
			const msg = Errors.getMessage(Errors.INVALID_AREA_LETTER, errorData);
			return Rej.BadRequest(msg);
		}
		if (stateful.getSessionData().area === area) {
			const msg = Errors.getMessage(Errors.ALREADY_IN_THIS_AREA, {'area': area});
			return Rej.BadRequest(msg);
		}
		const areaRows = stateful.getAreaRows();
		const isRequested = ($row) => $row['area'] === area;
		let row = ArrayUtil.getFirst(Fp.filter(isRequested, areaRows));

		const fullState = stateful.getFullState();
		if (!fullState.areas[fullState.area].gdsData) {
			// preserve area A session token
			fullState.areas[fullState.area].gdsData = stateful.getGdsData();
			stateful.updateFullState(fullState);
		}
		if (!row || !row.gdsData) {
			row = await startNewAreaSession(area);
		}
		await updateGdsData(row);

		return {
			calledCommands: [],
			userMessages: ['Successfully changed area to ' + area],
		};
	};

	const getEmptyAreasFromDbState =  () => {
		const isOccupied = (row) => row.hasPnr;
		const occupiedRows = Fp.filter(isOccupied, stateful.getAreaRows());
		const occupiedAreas = php.array_column(occupiedRows, 'area');
		occupiedAreas.push(stateful.getSessionData().area);

		return php.array_values(php.array_diff(AREA_LETTERS, occupiedAreas));
	};

	return {
		getEmptyAreas: getEmptyAreasFromDbState,
		forgeViewAreasDump: forgeViewAreasDump,
		changePcc: changePcc,
		changeArea: changeArea,
	};
};

FakeAreaUtil.AREA_LETTERS = AREA_LETTERS;
/** exposing for unit tests */
FakeAreaUtil.forgeViewAreasDump = forgeViewAreasDump;

module.exports = FakeAreaUtil;
