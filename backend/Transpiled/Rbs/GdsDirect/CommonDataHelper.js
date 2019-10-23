
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const Errors = require("./Errors");

const php = require('klesun-node-tools/src/Transpiled/php.js');

const ApoCmdParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const GalCmdParser = require('gds-utils/src/text_format_processing/galileo/commands/CmdParser.js');
const SabCmdParser = require('gds-utils/src/text_format_processing/sabre/commands/CmdParser.js');
const AmaCmdParser = require('../../Gds/Parsers/Amadeus/CommandParser.js');
const DateTime = require('../../Lib/Utils/DateTime.js');
const BadRequest = require("klesun-node-tools/src/Rej").BadRequest;
const NotImplemented = require("klesun-node-tools/src/Rej").NotImplemented;
const Fp = require('../../Lib/Utils/Fp.js');
const GalPnrParser = require("../../Gds/Parsers/Galileo/Pnr/PnrParser");
const GalileoPnrCommonFormatAdapter = require("../FormatAdapters/GalileoPnrCommonFormatAdapter");
const ApolloPnr = require("../TravelDs/ApolloPnr");
const ImportApolloPnrFormatAdapter = require("../Process/Apollo/ImportPnr/ImportApolloPnrFormatAdapter");
const SabrePnr = require("../TravelDs/SabrePnr");
const FormatAdapter = require("../IqControllers/FormatAdapter");
const AmadeusPnr = require("../TravelDs/AmadeusPnr");
const AmadeusPnrCommonFormatAdapter = require("../FormatAdapters/AmadeusPnrCommonFormatAdapter");
const NoContent = require("klesun-node-tools/src/Rej").NoContent;
const Rej = require('klesun-node-tools/src/Rej.js');
const {coverExc} = require('klesun-node-tools/src/Lang.js');

const CmsApolloTerminal = require('../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal');
const CmsSabreTerminal = require('../../Rbs/GdsDirect/GdsInterface/CmsSabreTerminal');
const CmsAmadeusTerminal = require('../../Rbs/GdsDirect/GdsInterface/CmsAmadeusTerminal');
const CmsGalileoTerminal = require('../../Rbs/GdsDirect/GdsInterface/CmsGalileoTerminal');

/**
 * provides functions that process generalized data from any GDS
 */
class CommonDataHelper {
	static getTicketingCommands() {
		return [
			'issueTickets', 'voidTicket', 'exchangeTicket', 'refundTicket', 'changeTickets',
			'unvoidPaperTicket', 'revalidateTicket',
		];
	}

	static getQueueCommands() {
		return [
			'openQueue', 'queueOperation', 'leaveQueue', 'removeFromQueue', 'movePnrToPccQueue',
			'movePnrToQueue', 'queueCount', 'ignoreMoveToQueue', 'queueRecordLocators',
		];
	}

	static getCountedFsCommands() {
		return ['lowFareSearch', 'lowFareSearchFromPnr', 'lowFareSearchUnclassified'];
	}

	static getTotallyForbiddenCommands() {
		return [
			'signIn', 'signOut', 'createAgent', 'branchTo', 'agentList', 'lniataList',
			'storePnrSendEmail', 'showSessionToken',
		];
	}

	static async shouldAddCreationRemark($msg, $cmdLog) {
		let $sessionData, $commands, $cmdRecord, $parsed, $flatCmds, $flatCmd;
		$sessionData = $cmdLog.getSessionData();
		if ($sessionData['isPnrStored']) {
			return false;
		}
		$commands = await $cmdLog.getCurrentPnrCommands();
		for ($cmdRecord of Object.values($commands)) {
			$parsed = this.parseCmdByGds($sessionData['gds'], $cmdRecord['cmd']);
			$flatCmds = php.array_merge([$parsed], $parsed['followingCommands']);
			for ($flatCmd of Object.values($flatCmds)) {
				if ($flatCmd['type'] === 'addRemark' && $flatCmd['data'] === $msg) {
					return false;
				}
			}
		}
		return true;
	}

	/** @param stateful = await require('StatefulSession.js')() */
	static async createCredentialMessage(stateful) {
		const $leadData = await stateful.getGdRemarkData();

		const $agent = stateful.getAgent();
		let $maxLen, $leadPart, $pattern, $minLen;
		$maxLen = {
			apollo: 87 - php.strlen('@:5'),
			galileo: 87,
			// 71 is limit for whole remark command: >5MSG LIMIT IS 70; >53¤MSG LIMIT IS 68;
			sabre: 71 - php.strlen('5'),
			amadeus: 126 - php.strlen('RM'),
		}[stateful.gds];
		$leadPart = php.empty($leadData) ? '' : (
			($agent.canSavePnrWithoutLead() ? '' : /FOR {leadAgent}/ + ($leadData['leadOwnerId'] || '')) +
			'/LEAD-' + $leadData['leadId']
		);
		// if you make changes here, please also update
		// Common\GenericRemarkParser::parseCmsLeadRemark()
		$pattern = php.implode('', [
			'GD-',
			'{pnrAgent}',
			'/' + $agent.getId(),
			$leadPart,
			' IN ' + stateful.getSessionData().pcc,
		]);
		$minLen = php.mb_strlen(StringUtil.format($pattern, {
			pnrAgent: '', leadAgent: '',
		}));
		return php.strtoupper(StringUtil.format($pattern, {
			pnrAgent: php.mb_substr($agent.getLogin(), 0, php.floor(($maxLen - $minLen) / 2)),
			leadAgent: php.mb_substr(!$leadData ? '' : $leadData.leadOwnerLogin, 0, php.floor(($maxLen - $minLen) / 2)),
		}));
	}

	static checkSeatCount($pnr) {
		let $errors, $passengerCount, $pax, $itinerary, $segment;
		$errors = [];
		$passengerCount = 0;
		for ($pax of Object.values($pnr.getPassengers())) {
			if (!$pax['nameNumber']['isInfant']) {
				$passengerCount++;
			}
		}
		if ($passengerCount === 0) {
			$errors.push(Errors.getMessage(Errors.NO_NAMES_IN_PNR));
		} else if (!($itinerary = $pnr.getItinerary())) {
			$errors.push(Errors.getMessage(Errors.ITINERARY_IS_EMPTY));
		} else {
			for ($segment of Object.values($itinerary)) {
				if ($segment['seatCount'] != $passengerCount) {
					$errors.push(Errors.getMessage(Errors.WRONG_SEAT_COUNT, {
						seatCount: $segment['seatCount'],
						nameCount: $passengerCount,
					}));
					break;
				}
			}
		}
		return $errors;
	}

	/**
	 * before:
	 * '   6 SSRCTCEQRHK1/VANIASDANDEY//YAHOO+COM-1PANDEY/DEVENDRA'
	 * '   7 SSRCTCMQRHK1/15123456627-1PANDEY/DEVENDRA'
	 * after:
	 * '   6 SSRCTCEQRHK1/XXXXXXXXXXXY//YAHOO+COM-1PANDEY/DEVENDRA'
	 * '   7 SSRCTCMQRHK1/XXXXXXXXX27-1PANDEY/DEVENDRA'
	 */
	static maskSsrContactInfo($output, $lettersShown = 1, $digitsShown = 2) {
		let $lines, $line, $lineNumber, $ssrStart, $emailRegex, $phoneRegex, $matches, $_, $prefix, $masked, $postfix;
		$lines = [];
		for ($line of Object.values(StringUtil.lines($output))) {
			$lineNumber = '(?:\\s*\\d+|GFAX-)\\.?\\s*';
			$ssrStart = '(?:[A-Z0-9]{2})?\\s*(?:[A-Z]{2}\\d+)?\\s*[\\\/\\s]';
			$emailRegex = '/^(' + $lineNumber + 'SSR\\s*CTCE\\s*' + $ssrStart + ')(.+?)(\\S{' + $lettersShown + '}\\\/\\\/.*|)$/';
			$phoneRegex = '/^(' + $lineNumber + 'SSR\\s*CTCM\\s*' + $ssrStart + ')(.+)(\\d{' + $digitsShown + '}.*)$/';
			if (php.preg_match($emailRegex, $line, $matches = [])) {
				[$_, $prefix, $masked, $postfix] = $matches;
				$line = $prefix + php.preg_replace(/./, 'X', $masked) + $postfix;
			}
			if (php.preg_match($phoneRegex, $line, $matches = [])) {
				[$_, $prefix, $masked, $postfix] = $matches;
				$line = $prefix + php.preg_replace(/./, 'X', $masked) + $postfix;
			}
			$lines.push($line);
		}
		return php.implode(php.PHP_EOL, $lines);
	}

	static isValidPnr($pnr) {
		if ($pnr.hasItinerary() ||
			!php.empty($pnr.getPassengers()) ||
			!php.empty($pnr.getRecordLocator())
		) {
			return true;
		}
		return false;
	}

	static parseCmdByGds($gds, $cmd) {
		if ($gds === 'apollo') {
			return ApoCmdParser.parse($cmd);
		} else if ($gds === 'galileo') {
			return GalCmdParser.parse($cmd);
		} else if ($gds === 'sabre') {
			return SabCmdParser.parse($cmd);
		} else if ($gds === 'amadeus') {
			return AmaCmdParser.parse($cmd);
		} else {
			return null;
		}
	}

	static parsePnrByGds($gds, $pnrDump) {
		const baseDt = php.date('Y-m-d H:i:s');
		if ($gds === 'apollo') {
			const $pnr = ApolloPnr.makeFromDump($pnrDump);
			return ImportApolloPnrFormatAdapter.transformReservation($pnr.getParsedData(), baseDt);
		} else if ($gds === 'galileo') {
			const $parsed = GalPnrParser.parse($pnrDump);
			return GalileoPnrCommonFormatAdapter.transform($parsed, baseDt);
		} else if ($gds === 'sabre') {
			const $pnr = SabrePnr.makeFromDump($pnrDump);
			return FormatAdapter.adaptSabrePnrParseForClient($pnr.getParsedData(), baseDt);
		} else if ($gds === 'amadeus') {
			const $pnr = AmadeusPnr.makeFromDump($pnrDump);
			return AmadeusPnrCommonFormatAdapter.transform($pnr.getParsedData(), baseDt);
		} else {
			return null;
		}
	}

	static makeIfcByGds(gds) {
		if (gds === 'apollo') {
			return new CmsApolloTerminal();
		} else if (gds === 'sabre') {
			return new CmsSabreTerminal();
		} else if (gds === 'amadeus') {
			return new CmsAmadeusTerminal();
		} else if (gds === 'galileo') {
			return new CmsGalileoTerminal();
		} else {
			throw new Error('Unsupported GDS - no interface implementation');
		}
	}

	static async _getSegUtc(seg, geo) {
		const fullDt = seg.departureDt.full;
		const tz = await geo.getTimezone(seg.departureAirport);
		if (tz) {
			return DateTime.toUtc(fullDt, tz);
		} else {
			return null;
		}
	}

	static async sortSegmentsByUtc(segments, geo) {
		const promises = segments.map(async seg => {
			const utc = await this._getSegUtc(seg, geo);
			return utc
				? Promise.resolve({utc, seg})
				: NotImplemented('No tz for seg ' + seg.segmentNumber + ' ' + seg.departureAirport, {isOk: true});
		});
		const utcRecords = await Promise.all(promises);
		const sorted = Fp.sortBy(r => r.utc, utcRecords).map(r => r.seg);
		if (php.equals(sorted, segments)) {
			return NoContent('Itinerary is already SORT-ed');
		} else {
			return {itinerary: sorted};
		}
	}

	/** @param stateful = require('StatefulSession.js')() */
	static async checkSavePnrRights({stateful, Pccs = require('../../../Repositories/Pccs.js')}) {
		const state = stateful.getSessionData();
		const agent = stateful.getAgent();
		const currentPcc = state.pcc;
		if (!state.isPnrStored) {
			// check rights to create new PNR
			const pccRow = await Pccs.findByCode(stateful.gds, currentPcc)
				.catch(coverExc([Rej.NotFound], exc => null));
			if (pccRow && !pccRow.data.can_book_pnr) {
				const msg = 'This PCC cannot be used for PNR creation - ' + currentPcc;
				return Rej.Forbidden(msg);
			}
		}
		if (!agent.canSavePnr()) {
			return Rej.Forbidden('You do not have rights to save PNRs');
		}
		return Promise.resolve();
	}

	/** @param stateful = require('StatefulSession.js')() */
	static async checkStorePricingPcc({stateful, Pccs = require('../../../Repositories/Pccs.js')}) {
		const currentPcc = stateful.getSessionData().pcc;
		const pccRow = await Pccs.findByCode(stateful.gds, currentPcc)
			.catch(coverExc([Rej.NotFound], exc => null));
		if (pccRow && !pccRow.data.can_store_fare) {
			const msg = 'This PCC cannot be used for Fare Storing -  ' + currentPcc;
			return Rej.Forbidden(msg);
		} else {
			return Promise.resolve();
		}
	}
}

module.exports = CommonDataHelper;
