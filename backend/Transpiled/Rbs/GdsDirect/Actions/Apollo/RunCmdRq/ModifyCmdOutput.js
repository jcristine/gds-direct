const UpdateState_apollo = require('gds-utils/src/state_tracking/UpdateState_apollo.js');
const Fp = require('../../../../../Lib/Utils/Fp.js');
const FareDisplayInternationalParser = require('../../../../../Gds/Parsers/Apollo/TariffDisplay/FareDisplayInternationalParser.js');
const FareDisplayDomesticParser = require('../../../../../Gds/Parsers/Apollo/TariffDisplay/FareDisplayDomesticParser.js');
const TariffDisplayParser = require('../../../../../Gds/Parsers/Apollo/TariffDisplay/TariffDisplayParser.js');
const StringUtil = require('../../../../../Lib/Utils/StringUtil.js');
const AirAvailabilityParser = require('gds-utils/src/text_format_processing/apollo/AirAvailabilityParser.js');
const CmsApolloTerminal = require('../../../GdsInterface/CmsApolloTerminal.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const CommandParser = require('gds-utils/src/text_format_processing/apollo/commands/CmdParser.js');
const ApoAliasParser = require('../../../../../../Parsers/Apollo/AliasParser.js');

/** @return bool - true if not error response, false otherwise */
const doesAvailJourneyTimeApply = (output) => {
	let hasAvail, isRbd;
	hasAvail = AirAvailabilityParser.parse(output).flights.length > 0;
	isRbd = StringUtil.startsWith(output, 'FIRAV');
	return hasAvail && !isRbd;
};

const modifyFare = (fare, decrease) => {
	if (decrease.units === 'percent') {
		fare = php.round(fare - fare * decrease.value / 100);
		return (+fare).toFixed(2);
	} else if (decrease.units === 'amount') {
		return (fare - decrease.value).toFixed(2);
	} else {
		return 'ERROR';
	}
};

/** decrease fare amounts by the value agent specified in the alias */
const modifyTariffDisplay = (output, decrease, firstCmdRow) => {
	let parsedHead, error, pattern, isFareLine, modified, line, split, data;
	parsedHead = TariffDisplayParser.parse(firstCmdRow.output);
	if (error = parsedHead.error || null) {
		// failed to parse the first page with column headers
		return output;
	}
	if (parsedHead.dumpType === 'DOMESTIC') {
		//         '  3-B6  338.00R SH2QBEN5 21| --/--  ||     -/15JUNC     -/-    ',
		pattern = '<<<<<<FFFFFFFF>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>';
		isFareLine = l => FareDisplayDomesticParser.parseFareLine(l);
	} else if (parsedHead.dumpType === 'INTERNATIONAL') {
		//         '  4 -SQ   324.00R QSQV     Q    |   /12M  01JAN -31DEC  R  PA D',
		pattern = '<<<<<<<FFFFFFFFF>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>';
		isFareLine = l => FareDisplayInternationalParser.parseFareLine(l);
	} else {
		// unsupported column format
		return output;
	}
	modified = [];
	for (line of Object.values(StringUtil.lines(output))) {
		if (isFareLine(line)) {
			split = StringUtil.splitByPosition(line, pattern, {
				'<': 'prefix', 'F': 'fare', '>': 'postfix',
			}, false);
			data = {
				'<': [split.prefix, 'left'],
				'F': [modifyFare(split.fare, decrease), 'right'],
				'>': [split.postfix, 'left'],
			};
			modified.push(StringUtil.formatLine(pattern, data));
		} else {
			modified.push(line);
		}
	}
	return php.implode(php.PHP_EOL, modified);
};

const ModifyCmdOutput = ({
	cmdRq, calledCommand, stateful, CmdRqLog,
}) => {
	const execute = async () => {
		calledCommand = {...calledCommand};
		let scrolledCmd, cmdParsed, type, output, lines, isSafe, clean, pcc,
			isOk;
		scrolledCmd = stateful.getSessionData().scrolledCmd || calledCommand.cmd;
		cmdParsed = CommandParser.parse(scrolledCmd);
		type = cmdParsed.type || null;
		if (php.in_array(type, ['searchPnr', 'displayPnrFromList']) &&
			!stateful.getAgent().canOpenPrivatePnr()
		) {
			output = StringUtil.wrapLinesAt(calledCommand.output, 64);
			lines = StringUtil.lines(output);
			isSafe = (line) => !StringUtil.contains(line, 'WEINSTEIN/ALEX');
			calledCommand.output = php.implode(php.PHP_EOL, Fp.filter(isSafe, lines));
		}
		if ((stateful.getSessionData().scrolledCmd || '').startsWith('$D')) {
			let alias;
			const scrolledCmdRow = (await stateful.getLog().getScrolledCmdMrs())[0];
			if (cmdRq.startsWith('$D')) {
				// initial $D display command
				alias = await ApoAliasParser.parse(cmdRq, stateful);
			} else {
				// MD on $D display
				const cmdRqId = !scrolledCmdRow ? null : scrolledCmdRow.cmd_rq_id;
				const cmdRqRow = !cmdRqId ? null : await CmdRqLog.getById(cmdRqId);
				alias = !cmdRqRow ? null : (await ApoAliasParser.parse(cmdRqRow.command || '', stateful));
			}
			if (alias && alias.type === 'fareSearchWithDecrease') {
				const decrease = alias.data || null;
				calledCommand.output = modifyTariffDisplay(
					calledCommand.output, decrease, scrolledCmdRow
				);
			}
		}
		if (type === 'airAvailability' && doesAvailJourneyTimeApply(calledCommand.output)) {
			clean = php.preg_replace(/><$/, '', calledCommand.output);
			calledCommand.output = php.rtrim(clean) + '  ' + 'JOURNEY TIME >A*J;  ><';
		}
		if (type === 'changePcc' && cmdParsed.data) {
			pcc = cmdParsed.data;
			isOk = UpdateState_apollo.wasPccChangedOk(calledCommand.output, cmdParsed.data);
			if (isOk) {
				calledCommand.output = 'YOU HAVE SUCCESSFULLY EMULATED TO ' + pcc;
			}
		}
		return calledCommand;
	};

	return execute();
};

module.exports = ModifyCmdOutput;
