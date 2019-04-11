
const php = require('../../../../php.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');

/** @param $expr = '1/3/5-7/9' */
let parseRanges = ($expr) => {
	let $parseRange;
	$parseRange = ($text) => {
		let $pair;
		$pair = php.explode('-', $text);
		return php.range($pair[0], $pair[1] || $pair[0]);
	};
	return Fp.flatten(Fp.map($parseRange, php.explode('/', php.trim($expr))));
};

// 'N1.1/1.2/2.1'
// 'N1.1-2.1'
// 'N1.1-2.1/4.1-5.1/6.0'
// 'N1¥N2'
let parseNameQualifier = ($token) => {
	let $content, $records;
	if (!StringUtil.startsWith($token, 'N')) {
		return null;
	} else {
		$content = php.substr($token, 1);
	}
	$records = Fp.map(($ptcToken) => {
		let $matches, $_, $from, $to;
		if (php.preg_match(/^(\d+(?:\.\d+|))(-\d+(?:\.\d+|)|)$/, $ptcToken, $matches = [])) {
			[$_, $from, $to] = $matches;
			$to = php.substr($to, 1);
			return {
				'fieldNumber': php.explode('.', $from)[0],
				'firstNameNumber': (php.explode('.', $from) || {})[1] || '0',
				'through': $to ? {
					'fieldNumber': php.explode('.', $to)[0],
					'firstNameNumber': (php.explode('.', $to) || {})[1] || '0',
				} : null,
			};
		} else {
			return null;
		}
	}, php.explode('/', $content));
	if (Fp.any('is_null', $records)) {
		return null;
	} else {
		return $records;
	}
};

/**
 * @param $token = 'S1/2-3*Q//DA25*PC05' || 'S1/3'
 * @return [1,2,3]
 */
let parseSegmentQualifier = ($token) => {
	let $regex, $matches;
	$regex =
		'/^S' +
		'(?<segNums>\\d+[\\d\\\/\\-]*)' +
		'(?<unparsed>\\*.+|)' +
		'$/';
	if (php.preg_match($regex, $token, $matches = [])) {
		return {
			'segmentNumbers': parseRanges($matches['segNums']),
			'unparsed': $matches['unparsed'],
		};
	} else {
		return null;
	}
}

// 'PADT', 'PINF'
// 'PADT/CMP' // companion
// 'PJCB/2JNF' // 1 JCB (adult) and 2 JNF (infants)
// 'P1ADT/2C11/1ADT'
let parsePtcQualifier = ($token) => {
	let $content, $records;
	if (!StringUtil.startsWith($token, 'P')) {
		return null;
	} else {
		$content = php.substr($token, 1);
	}
	$records = Fp.map(($ptcToken) => {
		let $matches, $_, $cnt, $ptc;
		if (php.preg_match(/^(\d*)([A-Z0-9]{3})$/, $ptcToken, $matches = [])) {
			[$_, $cnt, $ptc] = $matches;
			$cnt = $cnt !== '' ? php.intval($cnt) : null;
			return {'quantity': $cnt, 'ptc': $ptc};
		} else {
			return null;
		}
	}, php.explode('/', $content));
	if (Fp.any('is_null', $records)) {
		return null;
	} else {
		return $records;
	}
};

/**
 * @see https://formatfinder.sabre.com/Content/Pricing/PricingOptionalQualifiers.aspx?ItemID=7481cca11a7449a19455dc598d5e3ac9
 */
let parsePricingQualifier = ($token) => {
	let $name, $data, $matches, $_, $percentMarker, $region, $amount;
	[$name, $data] = [null, null];
	if ($token === 'RQ') {
		[$name, $data] = ['createPriceQuote', true];
	} else if ($token === 'ETR') {
		[$name, $data] = ['areElectronicTickets', true];
	} else if ($token === 'FXD') {
		[$name, $data] = ['forceProperEconomy', true];
	} else if (php.preg_match(/^MPC-(?<mpc>[A-Z0-9]+)$/, $token, $matches = [])) {
		[$name, $data] = ['maxPenaltyForChange', {
			'value': $matches['mpc'],
		}];
	} else if (php.in_array($token, ['PL', 'PV'])) {
		[$name, $data] = ['fareType', $token === 'PL' ? 'public' : 'private'];
	} else if ($data = parseNameQualifier($token)) {
		$name = 'names';
	} else if ($data = parsePtcQualifier($token)) {
		$name = 'ptc';
	} else if ($data = parseSegmentQualifier($token)) {
		$name = 'segments';
	} else if (php.preg_match(/^PU\*(\d*\.?\d+)(\/[A-Z0-9]+|)$/, $token, $matches = [])) {
		[$name, $data] = ['markup', $matches[1]];
	} else if (php.preg_match(/^K(P|)([A-Z]*)(\d*\.?\d+)$/, $token, $matches = [])) {
		[$_, $percentMarker, $region, $amount] = $matches;
		[$name, $data] = ['commission', {
			'units': $percentMarker ? 'percent' : 'amount',
			'region': $region || null,
			'value': $amount,
		}];
	} else if (php.preg_match(/^A([A-Z0-9]{2})$/, $token, $matches = [])) {
		[$name, $data] = ['validatingCarrier', $matches[1]];
	} else if (php.preg_match(/^C-([A-Z0-9]{2})$/, $token, $matches = [])) {
		[$name, $data] = ['governingCarrier', $matches[1]];
	} else if (php.preg_match(/^M([A-Z]{3})$/, $token, $matches = [])) {
		[$name, $data] = ['currency', $matches[1]];
	} else if (php.preg_match(/^AC\*([A-Z0-9]+)$/, $token, $matches = [])) {
		[$name, $data] = ['accountCode', $matches[1]];
	} else if (php.preg_match(/^ST(\d+[\d\/\-]*)$/, $token, $matches = [])) {
		[$name, $data] = ['sideTrip', parseRanges($matches[1])];
	} else if (php.preg_match(/^W(TKT)$/, $token, $matches = [])) {
		[$name, $data] = ['exchange', $matches[1]];
	} else if (php.preg_match(/^NC$/, $token, $matches = [])) {
		[$name, $data] = ['lowestFare', true];
	} else if (php.preg_match(/^NCS$/, $token, $matches = [])) {
		[$name, $data] = ['lowestFareIgnoringAvailability', true];
	} else if (php.preg_match(/^NCB$/, $token, $matches = [])) {
		[$name, $data] = ['lowestFareAndRebook', true];
	} else if (php.preg_match(/^Q([A-Z][A-Z0-9]*)$/, $token, $matches = [])) {
		[$name, $data] = ['fareBasis', $matches[1]];
	} else if (php.preg_match(/^TC-([A-Z]{2})$/, $token, $matches = [])) {
		[$name, $data] = ['cabinClass', {
			'YV': 'economy',
			'SB': 'premiumEconomy',
			'BB': 'business',
			'JB': 'premiumBusiness',
			'FB': 'first',
			'PB': 'premiumFirst',
		}[$matches[1]]];
	}
	return {
		raw: $token,
		type: $name,
		parsed: $data,
	};
};

let parsePricingQualifiers = ($qualifiers) => {
	let $parsedQualifiers, $qualifier;
	$parsedQualifiers = [];
	for ($qualifier of Object.values($qualifiers ? php.explode('¥', $qualifiers) : [])) {
		let mod = parsePricingQualifier($qualifier);
		$parsedQualifiers.push(mod);
	}
	return $parsedQualifiers;
};

exports.parseModifier = (mod) => parsePricingQualifier(mod);

exports.parse = ($cmd) => {
	let $command, $data;
	$command = php.substr($cmd, 0, 2);
	if ($command === 'WP') {
		$data = parsePricingQualifiers(php.substr($cmd, 2));
		return {
			'baseCmd': $command,
			'pricingModifiers': $data,
		};
	} else {
		return null;
	}
};