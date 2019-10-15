

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');

/**
 * parses output of >*SI; - non-airline SSR-s
 * Output example:
 * '** SPECIAL SERVICE REQUIREMENT **',
 * 'SEGMENT/PASSENGER RELATED',
 * 'S 1. DL  0890 M  20SEP RDUDTW',
 * '    P 1. SMITH/MARGARETH  VGML PN 1',
 * '    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
 * '                          LANG PN 1  ONLY SPEAKS JAPANESE',
 * '                          VGML PN 1',
 * '    P 3. SMITH/JOHN       VGML PN 1',
 * '    P 4. SMITH/MICHALE    VGML PN 1',
 * 'S 2. DL  0275 M  20SEP DTWNRT',
 * '    P 1. SMITH/MARGARETH  VGML PN 1',
 * '    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
 * '                          LANG PN 1  ONLY SPEAKS JAPANESE',
 * '                          VGML PN 1',
 * '    P 3. SMITH/JOHN       VGML PN 1',
 * '    P 4. SMITH/MICHALE    VGML PN 1',
 * '** OTHER SUPPLEMENTARY INFORMATION **',
 * 'CARRIER RELATED',
 * '  1. YY  1CHD SHIELDS/BMISS AGED 6YRS',
 * '  2. SSRCHLDDL HK  1 /-1SMITH/JOHN',
 * '  3. SSRCHLDDL NO  1 /-1SMITH/JOHN.INVLD FORMAT',
 */
const php = require('klesun-node-tools/src/Transpiled/php.js');
class SiParser
{
	static parseSegmentLine(line)  {
		//              'S 1. DL  0890 M  20SEP RDUDTW',
		//              'S 4. DL  0180 M  28SEP MNLNRT',
		//              'S11. OS  0655 D  21JUN VIEKIV',
		const pattern = 'SNN. YY  FFFF B  DDDDD PPPTTT';
		const symbols = php.str_split(pattern, 1);
		const names = php.array_combine(symbols, symbols);
		const split = StringUtil.splitByPosition(line, pattern, names, true);
		const result = {
			segmentNumber: php.trim(split['N'], ' .'),
			airline: split['Y'],
			flightNumber: split['F'],
			bookingClass: split['B'],
			departureDate: {
				raw: split['D'],
				parsed: CommonParserHelpers.parsePartialDate(split['D']),
			},
			departureAirport: split['P'],
			destinationAirport: split['T'],
		};
		if (split['S'] === 'S' && split[' '] === '' && split['.'] === '.' &&
            php.intval(result['segmentNumber']) && result['departureDate']['parsed']
		) {
			return result;
		} else {
			return null;
		}
	}

	static parsePaxSsrLine(line)  {
		//              '                          LANG PN 1  ONLY SPEAKS JAPANESE',
		//              '                          VGML PN 1',
		const pattern = '                          CCCC SS Q  MMMMMMMMMMMMMMMMMMMMMMMMMMM';
		const symbols = php.str_split(pattern, 1);
		const names = php.array_combine(symbols, symbols);
		const split = StringUtil.splitByPosition(line, pattern, names, true);
		const result = {
			ssrCode: split['C'],
			status: split['S'],
			statusNumber: split['Q'],
			comment: split['M'],
		};
		if (php.trim(split[' ']) === '' &&
            php.preg_match(/^[A-Z]{4}$/, result['ssrCode'])
		) {
			return result;
		} else {
			return null;
		}
	}

	static splitPaxSsrWrappedText(line)  {
		//              '                          WCHC NN 1  DISABLED LIKE A BUTTON ON -'.
		//              '                                     SALE SCREEN',
		const pattern = '                                     MMMMMMMMMMMMMMMMMMMMMMMMMMM';
		const symbols = php.str_split(pattern, 1);
		const names = php.array_combine(symbols, symbols);
		const split = StringUtil.splitByPosition(line, pattern, names, false);
		if (php.trim(split[' ']) === '' && php.trim(split['M'])) {
			return split['M'];
		} else {
			return '';
		}
	}

	/**
     * @param $mainLine = '/R/LV/MASK 012345678 AVAS 315/RIGA//13245--'
     * @param $wrappedLine = '1LIBERMANE/MARINA'
     */
	static unwrap($mainLine, $wrappedLine)  {

		return php.preg_replace(/-$/, '', $mainLine)+$wrappedLine;
	}

	static parsePassengerLine(line)  {
		//                 '    P 2. SMITH/MARGARETH  INFT KK 1  SMITH/KATHY 23APR17',
		//                 '    P 4. SMITH/MICHALE    VGML PN 1',
		//                 '    P11. LIBERMANE/ZIMIM| VGML NN 1',
		const paxPattern = '    PNN. FFFFFFFFFFFFFFF| ';
		const whitespace = php.str_repeat(' ', php.strlen(paxPattern));
		const ssrPart = whitespace+php.substr(line, php.strlen(whitespace));
		const ssr = this.parsePaxSsrLine(ssrPart);
		if (!ssr) {
			return null;
		}
		const $symbols = php.str_split(paxPattern, 1);
		const $names = php.array_combine($symbols, $symbols);
		const $split = StringUtil.splitByPosition(line, paxPattern, $names, true);
		const $result = {
			passengerNumber: $split['N'],
			passengerName: $split['F'],
			isNameTruncated: $split['|'] === '|',
			ssrs: [ssr],
		};
		if ($split['P'] === 'P' && $split[' '] === ''  &&
            $split['.'] === '.' && php.intval($result['passengerNumber'])
		) {
			return $result;
		} else {
			return null;
		}
	}

	static parseSegmentSsrBlock(linesLeft)  {
		const headerLine = php.array_shift(linesLeft);
		if (!headerLine) {
			return [[], linesLeft];
		}
		if (php.trim(headerLine) !== 'SEGMENT/PASSENGER RELATED') {
			php.array_unshift(linesLeft, headerLine);
			return [[], linesLeft];
		}
		const segments = [];
		let line;
		while (line = php.array_shift(linesLeft)) {
			const segment = this.parseSegmentLine(line);
			if (segment) {
				const paxes = [];
				let line;
				while (line = php.array_shift(linesLeft)) {
					const i = php.count(paxes) - 1;
					const j = php.count((paxes[i] || {}).ssrs || []) - 1;
					const passenger = this.parsePassengerLine(line);
					let ssr, wrapped;
					if (passenger) {
						paxes.push(passenger);
					} else if (!php.empty(paxes) && (ssr = this.parsePaxSsrLine(line))) {
						paxes[i].ssrs.push(ssr);
					} else if (!php.empty(paxes) && (wrapped = this.splitPaxSsrWrappedText(line))) {
						paxes[i].ssrs[j].comment = this.unwrap(paxes[i].ssrs[j].comment, wrapped);
					} else {
						php.array_unshift(linesLeft, line);
						break;
					}
				}
				segment.passengers = paxes;
				segments.push(segment);
			} else {
				php.array_unshift(linesLeft, line);
				break;
			}
		}
		return [segments, linesLeft];
	}

	// '/P/LV/X2345/LV/XXXXXXX/F/11MAR22/IVANOV/ZHORA/D/D-1LIBERMANE/LEPIN',
	// '/////XXXXXXX/F//WILLIAMS/MARIAMA-1LIBERMANE/STAS',
	// '/P/LV/X2345/LV/XXXXXXX/F/11MAR22/IVANOV/ZHORA/D /D/INVALID TEXT DATA-1LIBERMANE/LEPIN',
	// '/ /  /     /  /XXXXXXX/F/       /WILLIA/MARIA-1LIBERMANE/STAS',
	static parseDocsContent($content)  {
		let $message, $_, $travelDocType, $issuingCountry, $travelDocNumber, $nationality, $dob, $genderAndI, $expirationDate, $lastName, $firstName, $middleName, $primaryPassportHolderToken;

		[$content, $message] = php.array_pad(php.preg_split(/\s+/, $content), 2, '');
		[$_, $travelDocType, $issuingCountry, $travelDocNumber, $nationality, $dob, $genderAndI, $expirationDate, $lastName, $firstName, $middleName, $primaryPassportHolderToken] = php.array_pad(php.explode('/', $content), 12, '');

		return {
			travelDocType: $travelDocType,
			issuingCountry: $issuingCountry,
			travelDocNumber: $travelDocNumber,
			nationality: $nationality,
			dob: CommonParserHelpers.parsePastFullDate($dob),
			gender: $genderAndI[0],
			expirationDate: CommonParserHelpers.parseCurrentCenturyFullDate($expirationDate),
			lastName: $lastName,
			firstName: $firstName,
			middleName: $middleName,
			primaryPassportHolderToken: $primaryPassportHolderToken,  // Optional
			paxIsInfant: ($genderAndI[1]) === 'I',
			message: $message,
		};
	}

	static parseSsrContent($ssrCode, $content)  {
		let $matches, $_, $paxName, $data;

		if (php.preg_match(/^(.*)-1([A-Z][^\/]*\/[A-Z][^\/]*)$/, $content, $matches = [])) {
			[$_, $content, $paxName] = $matches;
		} else {
			$paxName = null;
		}
		if ($ssrCode === 'DOCS') {
			$data = this.parseDocsContent($content);
		} else {
			$data = null;
		}
		return {
			content: $content,
			paxName: $paxName,
			data: $data,
		};
	}

	// '  1. YY  1CHD SHIELDS/BMISS AGED 6YRS',
	// '  2. YY  1 CHLD AGED 5 ASDSD ASD ASD AS NJAS DASD HJASB DHASD H-'.
	// '         AVS DHJVAS DASV DHJVASDAS',
	static parseOsiLine(line)  {
		const regex =
            '/^\\s*'+
            '(?<lineNumber>\\d+)\\.\\s+'+
            '(?<airline>[A-Z0-9]{2})\\s+'+
            '(?<content>\\S.*?)'+
            '\\s*$/';
		let matches;
		if (php.preg_match(regex, line, matches = [])) {
			return {
				lineNumber: matches.lineNumber,
				ssrCode: 'OSI',
				airline: matches.airline,
				content: matches.content,
			};
		} else {
			return null;
		}
	}

	// '  2. SSRCHLDDL HK  1 /-1SMITH/JOHN',
	// '  3. SSRCHLDDL NO  1 /-1SMITH/JOHN.INVLD FORMAT',
	// '  3. SSRDOCSPS HK  1 /P/LV/X2345/LV/XXXXXXX/F/11MAR22/IVANOV/ZH-'.
	// '                     ORA/D/D-1LIBERMANE/LEPIN',
	static parseOtherSsrLine($line)  {
		let $regex, $matches;

		$regex =
            '/^\\s*'+
            '(?<lineNumber>\\d+)\\.\\s+SSR'+
            '(?<ssrCode>[A-Z]{4})\\s*'+
            '(?<airline>[A-Z0-9]{2})\\s*'+
            '(?<status>[A-Z]{2})\\s*'+
            '(?<statusNumber>\\d*)\\s*'+
            '(?<content>\\S.*?)'+
            '\\s*$/';
		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				lineNumber: $matches['lineNumber'],
				ssrCode: $matches['ssrCode'],
				airline: $matches['airline'],
				status: $matches['status'],
				statusNumber: $matches['statusNumber'],
				content: $matches['content'],
			};
		} else {
			return null;
		}
	}

	static parseOtherSsrBlock(linesLeft)  {
		const headerLine = php.array_shift(linesLeft);
		if (headerLine) {
			if (php.trim(headerLine) !== 'CARRIER RELATED') {
				php.array_unshift(linesLeft, headerLine);
			}
		}
		const ssrIndent = php.str_repeat(' ', 21);
		const osiIndent = php.str_repeat(' ', 9);
		let ssrs = [];
		let line;
		while (line = php.array_shift(linesLeft)) {
			const ssr = this.parseOsiLine(line) || this.parseOtherSsrLine(line);
			if (ssrs && StringUtil.startsWith(line, ssrIndent)) {
				ssrs[php.count(ssrs) - 1].content = this.unwrap(ssrs[php.count(ssrs) - 1].content,
					php.substr(line, php.strlen(ssrIndent)));
			} else if (ssrs && StringUtil.startsWith(line, osiIndent)) {
				ssrs[php.count(ssrs) - 1].content = this.unwrap(ssrs[php.count(ssrs) - 1].content,
					php.substr(line, php.strlen(osiIndent)));
			} else if (ssr) {
				ssrs.push(ssr);
			} else {
				php.array_unshift(linesLeft, line);
				break;
			}
		}
		ssrs = ssrs.map((ssr) => {
			const parsed = this.parseSsrContent(ssr.ssrCode, ssr.content);
			ssr.content = parsed.content;
			ssr.data = parsed.data;
			if (parsed.paxName) {
				ssr.data = ssr.data || {};
				ssr.data.paxName = parsed.paxName;
			}
			return ssr;
		});
		return [ssrs, linesLeft];
	}

	static parse(dump)  {
		dump = StringUtil.wrapLinesAt(dump, 64);
		let linesLeft = StringUtil.lines(dump);
		let headerLine = php.array_shift(linesLeft);
		let ssrSegments = [];
		let otherSsrs = [];
		if (php.trim(headerLine) === '** SPECIAL SERVICE REQUIREMENT **') {
			[ssrSegments, linesLeft] = this.parseSegmentSsrBlock(linesLeft);
			headerLine = php.array_shift(linesLeft);
		}
		if (php.trim(headerLine) === 'NO OSI EXISTS') {
			headerLine = php.array_shift(linesLeft);
		}
		if (php.trim(headerLine) === '** OTHER SUPPLEMENTARY INFORMATION **' ||
            php.trim(headerLine) === '** MANUAL SSR DATA **'
		) {
			[otherSsrs, linesLeft] = this.parseOtherSsrBlock(linesLeft);
			headerLine = php.array_shift(linesLeft);
		}
		if (headerLine !== null) {
			php.array_unshift(linesLeft, headerLine);
		}
		return {
			ssrSegments,
			otherSsrs,
			linesLeft,
		};
	}
}
module.exports = SiParser;
