const Rej = require('klesun-node-tools/src/Rej.js');
const PtcUtil = require('../Process/Common/PtcUtil.js');
const AtfqParser = require('../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const ParsersController = require('../../Rbs/IqControllers/ParsersController.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const CmsClient = require("../../../IqClients/CmsClient");
const {coverExc} = require('klesun-node-tools/src/Lang.js');

/**
 * provides functions to parse our custom formats
 * like MDA or RE/ generic for all GDS-es
 */
class AliasParser {
	static parseRe($cmd) {
		let $regex, $matches;
		$regex =
			'/^RE\/' +
			'(?<pcc>[A-Z0-9]{3,9})' +
			'(\/' +
			'(?<status>[A-Z]{2}|)' +
			'(?<seatCount>\\d*)' +
			')?' +
			'(?<keepOriginalMark>\\+|\\||)' +
			'$/';
		if (php.preg_match($regex, $cmd, $matches = [])) {
			return {
				pcc: $matches['pcc'],
				segmentStatus: $matches['status'] || '',
				seatCount: $matches['seatCount'] || '',
				keepOriginal: !php.empty($matches['keepOriginalMark']),
			};
		} else {
			return null;
		}
	}

	/**
	 * @return {Promise<null|{...}>} - rejection if it _is_ REBUILD command, but failed
	 *                                 to retrieve data, null if it is not REBUILD command
	 */
	static async parseCmsRebuild(cmd) {
		const asRebuild = cmd.match(/^REBUILD\/(\d+)\/([A-Z]{2})\/(\d+)$/);
		if (asRebuild) {
			const [_, itineraryId, segmentStatus, seatCount] = asRebuild;
			const cmsData = await CmsClient.getItineraryData({itineraryId});
			const pcc = cmsData.result.data.pcc;
			const segments = cmsData.result.data.segments.map(s => {
				const gdsDate = php.strtoupper(php.date('dM', php.strtotime(s.departureDate)));
				return ({
					...s, segmentStatus, seatCount,
					departureDate: {raw: gdsDate, parsed: s.departureDate.slice('2019-'.length), full: s.departureDate},
				});
			});
			return {pcc, segments};
		} else {
			return null;
		}
	}

	static parseMda($cmd) {
		let $matches, $realCmd, $limit;
		if (php.preg_match(/^(.*)\/MDA(\d*)$/, $cmd, $matches = [])) {
			$realCmd = $matches[1];
			$limit = $matches[2];
		} else if (php.preg_match(/^MDA(\d*)$/, $cmd, $matches = [])) {
			$realCmd = '';
			$limit = $matches[1];
		} else {
			return null;
		}
		return {
			realCmd: $realCmd,
			limit: $limit,
		};
	}

	static async parseStore(cmd, PtcUtil = require('../Process/Common/PtcUtil.js')) {
		let matches;
		if (php.preg_match(/^STORE([A-Z0-9]{3}|)\/?(.*)$/, cmd, matches = [])) {
			let [, ptc, modsPart] = matches;
			if (ptc === 'FXD') {
				// could probably just check that PTC is in the fare family
				// whitelist, and treat it as just a modifier if it's not...
				modsPart = modsPart ? 'FXD/' + modsPart : 'FXD';
				ptc = '';
			}
			const inputMods = AtfqParser.parsePricingModifiers(modsPart);
			const pricingModifiers = [];
			for (const mod of inputMods) {
				if (!ptc && mod.type === 'passengers' &&
					!mod.parsed.passengersSpecified &&
					mod.parsed.passengerProperties[0].ptc
				) {
					ptc = mod.parsed.passengerProperties[0].ptc;
				} else {
					pricingModifiers.push(mod);
				}
			}
			if (ptc) {
				const ptcFareType = await PtcUtil.getFareType(ptc);
				if (!ptcFareType) {
					return Rej.BadRequest('Invalid PTC - ' + ptc + ' - no known fare families matched');
				}
			}
			return {ptc, pricingModifiers};
		} else {
			return null;
		}
	}

	static async parsePrice($cmd, stateful) {
		let $matches;
		if (!php.preg_match(/^PRICE(MIX|)([A-Z0-9]{3}|)\/?(.*)$/, $cmd, $matches = [])) {
			return Promise.resolve(null);
		}
		let [$_, mix, inputPtc, modsPart] = $matches;
		let leadData = null;
		if (stateful.getLeadId()) {
			leadData = await stateful.getGdRemarkData();
		}
		let requestedAgeGroups = (leadData || {}).requestedAgeGroups || [];
		if (requestedAgeGroups.length === 0) {
			requestedAgeGroups = [
				{ageGroup: 'adult', quantity: 1},
				{ageGroup: 'child', quantity: 1},
				{ageGroup: 'infant', quantity: 1},
			];
		}
		if (inputPtc === 'FXD') {
			// could probably just check that PTC is in the fare family
			// whitelist, and treat it as just a modifier if it's not...
			modsPart = modsPart ? 'FXD/' + modsPart : 'FXD';
			inputPtc = '';
		}
		let isAll = false;
		if (inputPtc === 'ALL') {
			isAll = true;
			inputPtc = '';
		}
		const inputMods = AtfqParser.parsePricingModifiers(modsPart);
		const pricingModifiers = [];
		for (const mod of inputMods) {
			if (!inputPtc && mod.type === 'passengers' &&
				!mod.parsed.passengersSpecified &&
				mod.parsed.passengerProperties[0].ptc
			) {
				inputPtc = mod.parsed.passengerProperties[0].ptc;
			} else {
				pricingModifiers.push(mod);
			}
		}
		inputPtc = inputPtc || 'ADT';

		const ptcs = [];
		for (const group of requestedAgeGroups) {
			const ptc = await PtcUtil.convertPtcByAgeGroup(inputPtc, group.ageGroup, 7)
				.catch(coverExc([Rej.NotFound], exc => {
					return Rej.BadRequest('Invalid PTC - ' + exc.message);
				}));
			for (let i = 0; i < (group.quantity || 1); ++i) {
				ptcs.push(ptc);
			}
		}
		return {
			ptc: inputPtc,
			isMix: mix ? true : false,
			isAll, requestedAgeGroups,
			ptcs, pricingModifiers,
		};
	}

	static parseSameMonthReturnAvail(cmd) {
		const matches = cmd.match(/^A\*O(\d+)$/);
		if (matches) {
			return {days: matches[1]};
		} else {
			return null;
		}
	}

	/**
	 * @return {Promise<Object|null>} - reservation in importPnr format if
	 *  cmd is valid PNR dump, null if cmd is not a PNR dump, Promise.reject() if cmd
	 *  is a PNR dump, but there were issues parsing it, like invalid tokens caused by
	 *  manual changes to the text or it referencing a non-existing CMS PQ
	 */
	static async parseCmdAsPnr(cmd, session) {
		const fromCms = await this.parseCmsRebuild(cmd);
		if (fromCms) {
			return {
				pcc: fromCms.pcc,
				passengers: [],
				itinerary: fromCms.segments,
			};
		}
		if (!session.getAgent().canPasteItinerary()) {
			return null;
		}
		const guess = (new ParsersController()).guessDumpType({
			dump: cmd,
			creationDate: session.getStartDt(),
		}).result || null;

		const passengers = (guess.data || {}).passengers || [];
		const itinerary = (guess.data || {}).itinerary || [];

		for (let i = 0; i < itinerary.length; ++i) {
			const seg = itinerary[i];
			if (!seg.departureDt || !seg.departureDt.full) {
				const raw = (seg.departureDt || {}).raw || (seg.departureDate || {}).raw;
				const msg = 'Segment #' + (i + 1) + ' has invalid date' + (!raw ? '' : ' - ' + raw);
				return Rej.BadRequest(msg, itinerary);
			}
		}

		if (ParsersController.PNR_DUMP_TYPES.includes(guess['type']) &&
			itinerary.length > 0 || passengers.length > 0
		) {
			return Promise.resolve(guess.data);
		} else {
			return Promise.resolve(null);
		}
	}

	static async parseCmdAsItinerary($cmd, $session) {
		const asPnr = await this.parseCmdAsPnr($cmd, $session);
		return !asPnr ? [] : asPnr.itinerary;
	}

	static async parse(cmdRq, stateful) {
		cmdRq = cmdRq.replace(/\s+$/, '');
		// for when you copy itinerary from logs
		cmdRq = cmdRq.replace(/(^|\n)\s*"(.+?)",/g, '$1$2');
		const bulkCmds = cmdRq.split('\n');
		let type, data, matches;
		if (data = await AliasParser.parseCmdAsPnr(cmdRq, stateful)) {
			type = 'pnrDump';
		} else if (bulkCmds.length > 20) {
			return Rej.BadRequest('Too many lines (' + bulkCmds.length + ') in your input for bulk invocation');
		} else if (bulkCmds.length > 1) {
			type = 'bulkCmds';
			data = {bulkCmdRecs: bulkCmds.map(cmdRq => ({
				cmdRq, type: 'regularCmd',
			}))};
		} else if (matches = cmdRq.match(/^MP([A-Z0-9]{2})$/)) {
			type = 'addMpRemark';
			data = {airline: matches[1]};
		} else if (data = await this.parsePrice(cmdRq, stateful)) {
			type = 'priceAll';
		} else {
			type = 'regularCmd';
			data = null;
		}
		return Promise.resolve({cmdRq, type, data});
	}
}

module.exports = AliasParser;
