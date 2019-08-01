const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const CommonParserHelpers = require('../../../../Gds/Parsers/Apollo/CommonParserHelpers.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * SSR block is *R GFAX- line and several lines after that
 */
class SsrBlockParser {
	// 07AUG55 = 1955-08-07
	// 15AUG2016 = 2016-08-15
	static parseDateOfBirth($raw) {
		let $century, $matches, $_, $d, $m, $year, $parsedDob;
		$century = null;
		if (php.preg_match(/^(\d{1,2})([A-Z]{3})(\d{2})(\d{2})$/, $raw, $matches = [])) {
			// 4 digits in year
			[$_, $d, $m, $century, $year] = $matches;
			$raw = $d + $m + $year;
		}
		if ($parsedDob = CommonParserHelpers.parseApolloFullDate($raw)) {
			$year = php.substr($parsedDob, 0, 2);
			$century = $century || ($year > php.date('y') ? '19' : '20');
			$parsedDob = $century + $parsedDob;
		}
		return $parsedDob;
	}

	/**
	 * Known SSR types:
	 * ABAG ACKI ADMD ADPI ADTK ASVC AVML BBAG BBML BLML
	 * BSCT CBAG CHML CKIN CTCE CTCM DBML DOCA DOCO DOCS
	 * FQTV GFML HNML INFT INML KSML LCML LFML LSML MAAS
	 * MOML NSSA NSSB NSST NSSW OTHS PCTC PETC RQST RVML
	 * SFML SPML TKNE TKNM VGML VLML VOML WCBD WCHC WCHR
	 * WCHS WCOB OSI
	 */
	static getLineNumber($line) {
		let $num;
		$num = php.substr($line, 0, 5);
		return $num === 'GFAX-' ? 1 : php.intval(php.trim($num));
	}

	static getSsrCode($line) {
		let $ssrToken;
		$ssrToken = php.substr($line, 5, 3);
		if ($ssrToken === 'SSR') {
			return php.substr($line, 8, 4);
		} else if ($ssrToken === 'OSI') {
			return 'OSI';
		} else {
			return '__';
		}
	}

	static isMealSsrCode($code) {
		let $list;
		$list = [
			'AVML', 'BBML', 'BLML', 'CHML', 'CNML',
			'DBML', 'FPML', 'FSML', 'GFML', 'GRML',
			'GVML', 'HNML', 'JPML', 'KCML', 'KSML',
			'LCML', 'LFML', 'LSML', 'MOML', 'NLML',
			'RFML', 'RGML', 'RVML', 'SFML', 'SKML',
			'SPML', 'VGML', 'VJML', 'VLML', 'VOML',
		];
		return php.in_array($code, $list);
	}

	static isSeatSsrCode($code) {
		let $list;
		$list = ['NSST', 'SMSA', 'SMSW', 'NSSA', 'NSSW', 'RQST'];
		return php.in_array($code, $list);
	}

	static isWheelchairSsrCode($code) {
		let $list;
		$list = ['WCHR', 'WCHS', 'WCHC', 'WCBD', 'WCBW', 'WCMP', 'WCOB'];
		return php.in_array($code, $list);
	}

	static isDocSsrCode($code) {
		return php.in_array($code, ['DOCS', 'DOCA', 'DOCO']);
	}

	static isDisabilitySsrCode($code) {
		return this.isWheelchairSsrCode($code) || php.in_array($code, ['BLND', 'DEAF']);
	}

	static parseSeatSsrLine($line) {

	}

	// '  44 SSRADMD1VKK1 TO LH BY 06FEB 1333 OTHERWISE WILL BE CANCELLED
	// '   6 SSRADMD1VKK1 TO SA BY 12MAR 1344 OTHERWISE WILL BE CANCELLED
	static parseSsrAdmdLine($line) {
		let $pattern, $names, $result, $expectations;
		$pattern = '     _______     ___ AA___ DDDDD TTTT____________________________';
		$names = {
			'_': 'template',
			'A': 'airline',
			'D': 'date',
			'T': 'time',
		};
		$result = StringUtil.splitByPosition($line, $pattern, $names, true);
		if ($result['template'] === 'SSRADMD TO BY OTHERWISE WILL BE CANCELLED') {
			return {
				'airline': $result['airline'],
				'date': {
					'raw': $result['date'],
					'parsed': CommonParserHelpers.parsePartialDate($result['date']),
				},
				'time': {
					'raw': $result['time'],
					'parsed': CommonParserHelpers.decodeApolloTime($result['time']),
				},
			};
		} else {
			return null;
		}
	}

	static parseSegmentData($content) {
		let $pattern, $tokens;
		$pattern =
			'/^\\s*' +
			'(?<departureAirport>[A-Z]{3})' +
			'(?<destinationAirport>[A-Z]{3})\\s*' +
			'(?<flightNumber>\\d+)' +
			'(?<bookingClass>[A-Z])\\s*' +
			'(?<departureDate>\\d{1,2}[A-Z]{3})' +
			'\\s*$/';
		if (php.preg_match($pattern, $content, $tokens = [])) {
			return {
				'departureAirport': $tokens['departureAirport'],
				'destinationAirport': $tokens['destinationAirport'],
				'flightNumber': $tokens['flightNumber'],
				'bookingClass': $tokens['bookingClass'],
				'departureDate': {
					'raw': $tokens['departureDate'],
					'parsed': CommonParserHelpers.parsePartialDate($tokens['departureDate']),
				},
			};
		} else {
			return null;
		}
	}

	/**
	 * Some examples:
	 * '  19 SSRWCHRTPKK1 MADLIS 1011U27MAR-1PANDIT/DARSHANA+PAX CANT WALK LONG DISTANCE+IF BRINGING OWN WHEELCHAIR PLS REQ WCBD/WCMP/WCBW',
	 * '  29 SSRWCHCUAKK01 LAXNRT 0032K 24APR-1QUILING/NERY ',
	 * '  30 SSRWCHCNHKK01 NRTMNL 0819K 25APR-1QUILING/NERY+SPECIFY ESCORTED OR NOT N RQ MEDA IF ',
	 * '  31 SSRWCHCNHKK1 NRTMNL 0819K25APR-1ESPIRITU/FRANCIS+SPECIFY ESCORTED OR NOT N RQ MEDA IF APPLICABLE',
	 * '  13 SSRWCHCNHKK01 HNDLAX 0106K 15APR-1HERNANDO/ADORACION PICACHE+SPECIFY ESCORTED OR NOT',
	 * '  14 SSRWCHCUANO01 LAXYYC 8688K 15APR-1HERNANDO/ADORACION PICACHE ',
	 * '  18 SSRWCHCNHKK01 HNDLAX 0106K 15APR-1HERNANDO/BUTCH+SPECIFY ESCORTED OR NOT N RQ MEDA I',
	 * '  19 SSRWCHCUANO01 LAXYYC 8688K 15APR-1I/HERNANDO/BUTCH ',
	 * '  21 SSRLSMLETKK01 EWRLFW 0509G 19DEC  ',
	 */
	static parseMealOrDisabilityLine($line) {
		let $contentData, $segmentData;
		$contentData = this.extractContent($line);
		if (!$contentData) {
			return null;
		}
		$segmentData = this.parseSegmentData($contentData['content']);
		if (!$segmentData) {
			return null;
		} else {
			return php.array_merge($contentData, $segmentData);
		}
	}

	/**
	 * >HELP SSR-DOCS;
	 *
	 * Some examples:
	 * '   7 SSRDOCSBRHK1/////05JAN73/F//SYQUIA/RAQUEL/-1SYQUIA/RAQUEL',
	 * '   2 SSRDOCSKLHK1/////06DEC68/M//MORRISON/GEOFFREY/STEWART-1MORRISON/GEOFFREY STEWART',
	 * '  22 SSRDOCSDLHK1/////31MAR15/MI//CHUKWUMA/MAXWELL/IFECHUKWUKUNI-1I/CHUKWUMA/MAXWELL IFECHUKWUKUNI',
	 * 'GFAX-SSRDOCSETHK1/////31JAN66/M//HARUNA/AMADI/-1HARUNA/AMADI',
	 * '  16 SSRDOCSQRHK1/P/US/S123456778/US/12JUL66/M/23OCT12/SMITH/JOHN/RICHARD/H-1WAITHAKA/DAVID',
	 * '   8 SSRDOCSPRHK1/////02APR94/FI//STROBEL/AUDREY-1LIBERMANE/MARINA'
	 */
	static parseSsrDocsLine($line) {
		let $paxNumTokens, $paxNum, $paxInf, $documentInfo, $paxName, $pre, $travelDocType, $issuingCountry,
			$travelDocNumber, $nationality, $dob, $gender, $expirationDate, $lastName, $firstName, $middleName,
			$primaryPassportHolderToken, $parsedExpirationDate;
		$line = php.substr($line, php.mb_strlen('GFAX-SSRDOCS'));
		php.preg_match(/-(?<paxNum>\d+)(?<paxInf>I\/)?/, $line, $paxNumTokens = []);
		$paxNum = php.array_key_exists('paxNum', $paxNumTokens) ? $paxNumTokens['paxNum'] : '';
		$paxInf = $paxNumTokens['paxInf'] ? true : false;
		[$documentInfo, $paxName] = php.array_pad($line.split(/-\d+(?:I\/)?/), 2, '');
		[$pre, $travelDocType, $issuingCountry, $travelDocNumber, $nationality, $dob, $gender, $expirationDate, $lastName, $firstName, $middleName, $primaryPassportHolderToken] = php.array_pad(php.explode('/', $documentInfo), 12, '');
		$parsedExpirationDate = CommonParserHelpers.parseApolloFullDate($expirationDate);
		return {
			//'pre' => $pre,
			'travelDocType': $travelDocType,
			'issuingCountry': $issuingCountry,
			'travelDocNumber': $travelDocNumber,
			'nationality': $nationality,
			'dob': {
				'raw': $dob,
				'parsed': this.parseDateOfBirth($dob),
			},
			'gender': $gender,
			'expirationDate': {
				'raw': $expirationDate,
				'parsed': $parsedExpirationDate ? '20' + $parsedExpirationDate : null,
			},
			'lastName': $lastName,
			'firstName': $firstName,  // May also contain middle name (separated by space)
			'middleName': $middleName,  // Optional
			'primaryPassportHolderToken': $primaryPassportHolderToken,  // Optional
			'paxNum': $paxNum,
			'paxIsInfant': $paxInf,
			'paxName': $paxName,
		};
	}

	/**
	 * >HELP SSR-DOCA;
	 *
	 * Some examples:
	 * '   6 SSRDOCACAHK1/R/US/1800 SMITH STREET/HOUSTON/TX/12345-1LIBERMANE/MARINA'
	 */
	static parseSsrDocaLine($line) {
		let $paxNumTokens, $paxNum, $paxInf, $documentInfo, $paxName, $pre, $addressType, $country, $addressDetails,
			$city, $province, $postalCode;
		$line = php.substr($line, php.mb_strlen('GFAX-SSRDOCA'));
		php.preg_match(/-(?<paxNum>\d+)(?<paxInf>I\/)?/, $line, $paxNumTokens = []);
		$paxNum = php.array_key_exists('paxNum', $paxNumTokens) ? $paxNumTokens['paxNum'] : '';
		$paxInf = $paxNumTokens['paxInf'] ? true : false;
		[$documentInfo, $paxName] = php.array_pad($line.split(/-\d+(?:I\/)?/), 2, '');
		[$pre, $addressType, $country, $addressDetails, $city, $province, $postalCode] = php.array_pad(php.explode('/', $documentInfo), 7, '');
		return {
			//'pre' => $pre,
			'addressType': $addressType,
			'country': $country,
			'addressDetails': $addressDetails,
			'city': $city,
			'province': $province,
			'postalCode': $postalCode,
			'paxNum': $paxNum,
			'paxIsInfant': $paxInf,
			'paxName': $paxName,
		};
	}

	/**
	 * >HELP SSR-DOCO;
	 *
	 * Some examples:
	 * '  12 SSRDOCOUAHK1 //K/987109365///US-1RANDAZZO/RALPHMICHAEL',
	 * '  10 SSRDOCOUAHK1 //K/986903940///US-1ALPERT/GEOFFREYMARSHALL',
	 * '  10 SSRDOCODLHK1//K/TT1133H33///US-1LABORDEIII/CLIFFE EDWARD',
	 * '  10 SSRDOCODLHK1//K/TT115T3VF///US-1HINES/LORI JO',
	 * '   8 SSRDOCOBAHK1//K/986183119///',
	 * '   5 SSRDOCOCAHK1/PARIS FR/V/12345123/LONDON GBR/14MAR11/US-1LIBERMANE/MARINA'
	 */
	static parseSsrDocoLine($line) {
		let $paxNumTokens, $paxNum, $paxInf, $documentInfo, $paxName, $pre, $placeOfBirth, $travelDocType,
			$travelDocNumber, $issuingCountry, $dateOfBirth, $countryWhereApplies;
		$line = php.substr($line, php.mb_strlen('GFAX-SSRDOCO'));
		php.preg_match(/-(?<paxNum>\d+)(?<paxInf>I\/)?/, $line, $paxNumTokens = []);
		$paxNum = php.array_key_exists('paxNum', $paxNumTokens) ? $paxNumTokens['paxNum'] : '';
		$paxInf = $paxNumTokens['paxInf'] ? true : false;
		[$documentInfo, $paxName] = php.array_pad($line.split(/-\d+(?:I\/)?/), 2, '');
		[$pre, $placeOfBirth, $travelDocType, $travelDocNumber, $issuingCountry, $dateOfBirth, $countryWhereApplies] = php.array_pad(php.explode('/', $documentInfo), 7, '');
		return {
			//'pre' => $pre,
			'placeOfBirth': $placeOfBirth,
			'travelDocType': $travelDocType,
			'travelDocNumber': $travelDocNumber,
			'issuingCountry': $issuingCountry,
			'dateOfIssue': {
				'raw': $dateOfBirth,
				'parsed': this.parseDateOfBirth($dateOfBirth),
			},
			'countryWhereApplies': $countryWhereApplies,
			'paxNum': $paxNum,
			'paxIsInfant': $paxInf,
			'paxName': $paxName,
		};
	}

	// '  16 SSRTKNEUAHK01 NRTORD 7926K 07MAR-1ARCE/MARIAPAZ.0167827230576C1/575-576'
	// '   6 SSRTKNEBAHK01 LHRBLQ 0542J 21NOV-1BONAN/CHARLES.1257408947052C4',
	static parseSsrTkneData($contentData) {
		let $content, $comment, $segment, $matches, $_, $ticketNumber, $couponNumber, $unparsed;
		$content = $contentData['content'];
		$comment = $contentData['comment'];
		$segment = this.parseSegmentData($content);
		if (!$segment) {
			return null;
		} else if (php.preg_match(/^(\d{13})C(\d+)(.*)$/, $comment, $matches = [])) {
			[$_, $ticketNumber, $couponNumber, $unparsed] = $matches;
			$segment['ticketNumber'] = $ticketNumber;
			$segment['couponNumber'] = $couponNumber;
			if ($unparsed) {
				$segment['unparsed'] = $unparsed;
			}
			return $segment;
		} else {
			return null;
		}
	}

	static getAirline($line) {
		let $filter, $matches;
		$filter = /^.{5}(?:SSR[A-Z]{4}|OSI)([0-9A-Z]{2})/;
		$matches = [];
		if (php.preg_match($filter, $line, $matches = [])) {
			return $matches[1];
		} else {
			return null;
		}
	}

	// '  16 SSRDOCSQRHK1/P/US/S123456778/US/12JUL66/M/23OCT12/SMITH/JOHN/RICHARD/H-1WAITHAKA/DAVID',
	//                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
	static extractContent($line) {
		let $regex, $matches;
		$regex =
			'/^\\s*' +
			'(?<lineNumber>GFAX|\\d+)[\\s\\-]*SSR\\s*' +
			'(?<ssrCode>[A-Z]{4})\\s*' +
			'(?<airline>[A-Z0-9]{2}|)\\s*' +
			'(' +
			'TO(?<toAirline>[A-Z0-9]{2})\\s*' +
			'|' +
			'(?<status>[A-Z]{2})' +
			'(?<statusNumber>\\d*)' +
			')?' +
			'(?<content>.*?)' +
			'(-1' +
			'(?<paxInf>I\\\/)?' +
			'(?<paxName>[A-Z][^\\\/\\.]*\\\/?([A-Z][^\\\/\\.]*?)?)\\s*' +
			'(\\.(?<comment>.*))?' +
			')?' +
			'$/';
		if (php.preg_match($regex, $line, $matches = [])) {
			return {
				'lineNumber': $matches['lineNumber'] === 'GFAX' ? 1 : $matches['lineNumber'],
				'ssrCode': $matches['ssrCode'],
				'airline': $matches['airline'],
				'toAirline': $matches['toAirline'] || null,
				'status': $matches['status'] || null,
				'statusNumber': $matches['statusNumber'] || null,
				'content': $matches['content'],
				'paxIsInfant': !php.empty($matches['paxInf']),
				'paxName': $matches['paxName'] || null,
				'comment': $matches['comment'] || null,
			};
		} else {
			return null;
		}
	}

	static parse($dump) {
		let $result, $line, $lineNumber, $ssrCode, $airline, $extracted, $lineData;
		$result = [];
		for ($line of StringUtil.lines($dump)) {
			$lineNumber = this.getLineNumber($line);
			$ssrCode = this.getSsrCode($line);
			$airline = this.getAirline($line);
			$extracted = this.extractContent($line);
			if ($ssrCode === 'DOCS') {
				$lineData = this.parseSsrDocsLine($line);
			} else if ($ssrCode === 'DOCA') {
				$lineData = this.parseSsrDocaLine($line);
			} else if ($ssrCode === 'DOCO') {
				$lineData = this.parseSsrDocoLine($line);
			} else if ($extracted && $extracted['ssrCode'] === 'TKNE') {
				$lineData = this.parseSsrTkneData($extracted);
			} else if (this.isMealSsrCode($ssrCode)) {
				$lineData = this.parseMealOrDisabilityLine($line);
			} else if (this.isDisabilitySsrCode($ssrCode)) {
				$lineData = this.parseMealOrDisabilityLine($line);
				// TODO: there's also ADMD support, which is currently unused,
				// because there's no real need in that
			} else {
				$lineData = null
				//?? static::parseSsrAdmdLine($line)
				;
			}
			if ($lineData && $extracted && $extracted['paxName']) {
				$lineData['paxName'] = $extracted['paxName'];
			}
			$result.push({
				'lineNumber': $lineNumber,
				'airline': $airline,
				'ssrCode': $ssrCode,
				'content': $extracted ? $extracted['content'] : null,
				'data': $lineData,
				'line': $line,
			});
		}
		return $result;
	}
}

module.exports = SsrBlockParser;
