// namespace Rbs\GdsDirect\Actions\Common;

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const LocationGeographyProvider = require('../../../../Rbs/DataProviders/LocationGeographyProvider.js');
const RbsClient = require("../../../../../IqClients/RbsClient");
const NormalizeTariffCmd = require('./NormalizeTariffCmd.js');
const MakeMultiPccTariffDumpAction = require('./MakeMultiPccTariffDumpAction.js');

let php = require('../../../../php.js');
const {allWrap, timeout} = require("../../../../../Utils/Misc");

/**
 * schedule multiple async jobs that fetch tariff displays in different PCC-s
 * wait for them to finish and return all fares from all PCC-s in one dump
 */
class GetMultiPccTariffDisplayAction {
	constructor() {
		this.$repriceRules = null;
		this.$log = ($msg, $data) => {

		};
		this.$geoProvider = new LocationGeographyProvider();
		this.$baseDate = php.date('Y-m-d H:i:s');
	}

	setLog($log) {
		this.$log = $log;
		return this;
	}

	log($msg, $data) {
		let $log;
		$log = this.$log;
		$log($msg, $data);
		return this;
	}

	setGeoProvider($geoProvider) {
		this.$geoProvider = $geoProvider;
		return this;
	}

	setBaseDate($baseDate) {
		this.$baseDate = $baseDate;
		return this;
	}

	setRepriceRules($rules) {
		this.$repriceRules = $rules;
		return this;
	}

	async getRepriceRules() {
		if (!this.$repriceRules) {
			// TODO: fetch from RBS
			let apiData = {"records":[{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"35","name":"Middle East"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2I3L","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}],"id":"26"},{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"39","name":"Latin America"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G8P","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F9B","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"15D9","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"LAXGO3106","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}],"id":"28"},{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"34","name":"Africa"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F9B","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}],"id":"30"},{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"33","name":"Europe"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"LAXGO3106","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}],"id":"32"},{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"37","name":"Oceania"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"LAXGO3106","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}],"id":"34"},{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"42","name":"India \u0026 ISC"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2I3L","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}],"id":"36"},{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[{"type":"region","value":"36","name":"Asia"}],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2E8R","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F9B","ptc":"JWZ","account_code":"","fare_type":""}],"id":"38"},{"departure_items":[{"type":"country","value":"CA","name":"Canada"}],"destination_items":[],"reprice_pcc_records":[{"gds":"apollo","pcc":"2BQ6","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2E4T","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2I70","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2E1I","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2ER7","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"10OW","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"RR8F","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5EGB","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"T42I","ptc":"JCB","account_code":"","fare_type":""},{"gds":"amadeus","pcc":"YTOGO310E","ptc":"","account_code":"","fare_type":"private"},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F9B","ptc":"JWZ","account_code":"","fare_type":""}],"id":"40"},{"departure_items":[{"type":"country","value":"GB","name":"United Kingdom"}],"destination_items":[],"reprice_pcc_records":[{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"0EKH","ptc":"ITX","account_code":"BSAG","fare_type":""},{"gds":"sabre","pcc":"0EKH","ptc":"","account_code":"BSAG","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"K2MI","ptc":"","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"galileo","pcc":"K9P","ptc":"ITX","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"K9P","ptc":"","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"G8T","ptc":"ITX","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"G8T","ptc":"","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"3ZV4","ptc":"ITX","account_code":"BSAG","fare_type":"private"},{"gds":"galileo","pcc":"3ZV4","ptc":"","account_code":"BSAG","fare_type":"private"}],"id":"42"},{"departure_items":[{"type":"country","value":"US","name":null}],"destination_items":[],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"6IIF","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F3K","ptc":"JWZ","account_code":"","fare_type":""}],"id":"44"},{"departure_items":[],"destination_items":[],"reprice_pcc_records":[{"gds":"apollo","pcc":"1O3K","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G52","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2F9B","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"13NM","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"apollo","pcc":"2G2H","ptc":"JWZ","account_code":"","fare_type":""},{"gds":"sabre","pcc":"U2E5","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"5E9H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"DK8H","ptc":"JCB","account_code":"","fare_type":""},{"gds":"sabre","pcc":"0EKH","ptc":"ITX","account_code":"BSAG","fare_type":"private"},{"gds":"sabre","pcc":"0EKH","ptc":"","account_code":"BSAG","fare_type":"private"},{"gds":"sabre","pcc":"K2MI","ptc":"JCB","account_code":"","fare_type":""},{"gds":"galileo","pcc":"K9P","ptc":"ITX","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"K9P","ptc":"","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"G8T","ptc":"ITX","account_code":"TPACK","fare_type":"private"},{"gds":"galileo","pcc":"G8T","ptc":"","account_code":"TPACK","fare_type":"private"}],"id":"46"}]};
			this.$repriceRules = apiData.records;
		}
		return Promise.resolve(this.$repriceRules);
	}

	// should those be defined in GUI with departure => null and destination => null maybe?
	static getFallbackPccs() {
		let $pccs, $reprices, $pccRec, $pccReprices;
		$pccs = [
			{'gds': 'apollo', 'pcc': '1O3K'},
			{'gds': 'apollo', 'pcc': '2G52'},
			{'gds': 'apollo', 'pcc': '2F9B'},
			{'gds': 'apollo', 'pcc': '13NM'},
			{'gds': 'apollo', 'pcc': '2G2H'},
			{'gds': 'sabre', 'pcc': 'U2E5'},
			{'gds': 'sabre', 'pcc': '5E9H'},
			{'gds': 'sabre', 'pcc': 'DK8H'},
			{'gds': 'sabre', 'pcc': '0EKH'},
			{'gds': 'sabre', 'pcc': 'K2MI'},
			{'gds': 'galileo', 'pcc': 'K9P'},
			{'gds': 'galileo', 'pcc': 'G8T'},
		];
		$reprices = [];
		for ($pccRec of Object.values($pccs)) {
			$pccReprices = this.applyDefaultRepriceRules($pccRec['gds'], $pccRec['pcc']);
			$reprices = php.array_merge($reprices, $pccReprices);
		}
		return $reprices;
	}

	static matchesLocation($airport, $locationItems, $geo) {
		return php.empty($locationItems) || Fp.any(($item) => {
			if ($item['type'] === 'airport') {
				return $item['value'] === $airport;
			} else if ($item['type'] === 'city') {
				return $geo.doesBelongToCity($airport, $item['value']);
			} else if ($item['type'] === 'country') {
				return $item['value'] === $geo.getCountryCode($airport);
			} else if ($item['type'] === 'region') {
				return $item['value'] == $geo.getRegionId($airport);
			} else {
				return false;
			}
		}, $locationItems);
	}

	static transformPccRecordFromDb($pccRec) {
		return php.array_filter({
			'gds': $pccRec['gds'],
			'pcc': $pccRec['pcc'],
			'ptc': $pccRec['ptc'] || null,
			'accountCode': $pccRec['account_code'] || null,
			'fareType': $pccRec['fare_type'] || null,
		});
	}

	/** @param $rules = [MultiPccTariffRuleJsApiController::normalizeRule()] */
	getRoutePccs($depAirport, $destAirport, $rules) {
		let $rule, $geo;
		for ($rule of Object.values($rules)) {
			$geo = this.$geoProvider;
			if (this.constructor.matchesLocation($depAirport, $rule['departure_items'], $geo) &&
				this.constructor.matchesLocation($destAirport, $rule['destination_items'], $geo)
			) {
				return php.array_map(a => this.constructor.transformPccRecordFromDb(a), $rule['reprice_pcc_records']);
			}
		}
		return [];
	}

	async getPccs($cmdData, $sessionData) {
		let $routeRules, $fallbackPccs, $rules, $rule, $pccs, $isCurrent;
		$routeRules = [];
		$fallbackPccs = this.constructor.getFallbackPccs();
		$rules = await this.getRepriceRules();
		for ($rule of Object.values($rules)) {
			if ($rule['departure_items'] || $rule['destination_items']) {
				$routeRules.push($rule);
			} else {
				$fallbackPccs = $rule['reprice_pcc_records'];
			}
		}
		let pccsFromRules = php.array_merge(
			this.getRoutePccs($cmdData['departureAirport'], $cmdData['destinationAirport'], $routeRules),
			this.getRoutePccs($cmdData['destinationAirport'], $cmdData['departureAirport'], $routeRules),
		);
		$pccs = pccsFromRules.length > 0 ? pccsFromRules : $fallbackPccs;
		$isCurrent = ($pccRec) => {
			return $pccRec['gds'] === $sessionData['gds']
				&& $pccRec['pcc'] === $sessionData['pcc'];
		};
		if (!Fp.any($isCurrent, $pccs)) {
			$pccs.push({'gds': $sessionData['gds'], 'pcc': $sessionData['pcc']});
		}
		return $pccs;
	}

	// should not be needed I guess once we add _current_ PCC and fallback PCC-s in the GUI
	static applyDefaultRepriceRules($gds, $pcc) {
		let $extensions;
		$extensions = [];
		if ($gds === 'apollo') {
			$extensions.push({'ptc': 'JWZ'});
		} else if ($gds === 'sabre') {
			if (php.in_array($pcc, ['6IIF', '5E9H', 'RR8F', '5EGB', 'DK8H', 'T42I', 'U2E5'])) {
				$extensions.push({'ptc': 'JCB'});
			}
			if ($pcc === '0EKH') {
				$extensions.push({'accountCode': 'BSAG', 'ptc': 'ITX'}); // FQLONNYC20SEP¥RR*BSAG¥PITX
				$extensions.push({'accountCode': 'BSAG', 'ptc': null});  // FQLONNYC20SEP¥RR*BSAG
			}
		} else if ($gds === 'amadeus') {
			$extensions.push({'fareType': 'private'}); // /R,U
		} else if ($gds === 'galileo') {
			if (php.in_array($pcc, ['K9P', 'G8T'])) {
				$extensions.push({'accountCode': 'TPACK', 'fareType': 'private', 'ptc': 'ITX'}); // FDLONNYC25SEP*ITX-PRI-TPACK:P
				$extensions.push({'accountCode': 'TPACK', 'fareType': 'private', 'ptc': null});  // FD2OCTLONWAS-PRI-TPACK:P
			}
			if ($pcc === '3ZV4') {
				$extensions.push({'accountCode': 'BSAG', 'fareType': 'private', 'ptc': 'ITX'}); // FDLONNYC25SEP*ITX-PRI-TPACK:P
				$extensions.push({'accountCode': 'BSAG', 'fareType': 'private', 'ptc': null});  // FD2OCTLONWAS-PRI-TPACK:P
			}
		}
		return Fp.map(($ext) => {
			return php.array_merge({
				'gds': $gds, 'pcc': $pcc,
			}, $ext);
		}, $extensions.length > 0 ? $extensions : [[]]);
	}

	static extendFromPccRecord($rpcParams, $pccRec, $sessionData) {
		$rpcParams = {...$rpcParams};
		if ($pccRec['gds'] !== $sessionData['gds']) {
			delete($rpcParams['ptc']);
			delete($rpcParams['fareType']);
			delete($rpcParams['accountCode']);
		}
		$rpcParams['pcc'] = $pccRec['pcc'];
		$rpcParams['gds'] = $pccRec['gds'];
		delete($pccRec['pcc']);
		delete($pccRec['gds']);
		if (php.empty(php.array_intersect_key($rpcParams, $pccRec))) {
			$rpcParams = php.array_merge($rpcParams, $pccRec);
		}
		return $rpcParams;
	}

	static transformFareType($inParserFormat) {
		let $inRpcFormat;
		$inRpcFormat = {
			'public': 'published',
			'private': 'private',
			'agencyPrivate': 'airline_private',
			'airlinePrivate': 'agency_private',
			'netAirlinePrivate': 'net_private',
		}[$inParserFormat] || null;
		return $inRpcFormat;
	}

	async makeRpcParamOptions($cmd, $sessionData) {
		let $cmdData, $departureDate, $returnDate, $params, $type, $data, $options, $pccRec;
		$cmdData = (new NormalizeTariffCmd())
			.setBaseDate(this.$baseDate)
			.execute($cmd, $sessionData['gds']);
		if (!$cmdData) {
			return {'error': ['Failed to parse base Tariff Display command ' + $cmd]};
		}
		$departureDate = ($cmdData['departureDate'] || {})['full'];
		$returnDate = ($cmdData['returnDate'] || {})['full'];
		$params = {
			'maxFares': 40,
			'timeout': this.constructor.TIMEOUT * 2 / 3,
			'departureDate': $departureDate,
			'returnDate': $returnDate,
			'departureAirport': $cmdData['departureAirport'],
			'destinationAirport': $cmdData['destinationAirport'],
		};
		for ([$type, $data] of Object.entries($cmdData['typeToData'])) {
			if ($type === 'airlines') {
				$params['airlines'] = $data;
			} else if ($type === 'tripType') {
				$params['tripType'] = $data;
			} else if ($type === 'ptc') {
				$params['ptc'] = $data;
			} else if ($type === 'cabinClass') {
				$params['cabinClass'] = $data;
			} else if ($type === 'fareType') {
				$params['fareType'] = this.constructor.transformFareType($data);
			} else if ($type === 'accountCode') {
				$params['accountCode'] = $data;
			} else {
				return {'error': 'Unsupported modifier - ' + $type};
			}
		}
		$options = [];
		for ($pccRec of Object.values(await this.getPccs($cmdData, $sessionData))) {
			$options.push(this.constructor.extendFromPccRecord($params, $pccRec, $sessionData));
		}
		$options = php.array_values(Fp.map(a => ArrayUtil.getFirst(a), Fp.groupBy(a => JSON.stringify(a), $options)));
		return {
			'baseParams': $params,
			'options': $options,
			'cmdData': $cmdData,
		};
	}

	static formatJobError($job) {
		let $error;
		if (!php.in_array($job['jobResult']['response_code'], [1, 2])) {
			$error = php.implode('; ', $job['jobResult']['errors'] || []);
		} else {
			$error = 'NO FARES MATCHING REQUEST';
		}
		return $job['pcc'] + ': ' + $error;
	}

	logFinishedJobs($finishedJobs, $startedJobs) {
		let $finishedIds, $unfinished;
		this.log('Got ' + php.count($finishedJobs) + ' of ' + php.count($startedJobs) + ' jobs done: ' +
			php.implode(', ', php.array_column($finishedJobs, 'pcc')), $finishedJobs);
		$finishedIds = php.array_column($finishedJobs, 'jobId');
		$unfinished = Fp.filter(($started) => {
			return !php.in_array($started['jobId'], $finishedIds);
		}, $startedJobs);
		if ($unfinished) {
			this.log('WARNING: Got ' + php.count($unfinished) + ' undone jobs: ' +
				php.implode(', ', php.array_column($unfinished, 'pcc')), $unfinished);
		}
	}

	/** unlike array_diff_assoc, this function does not throw NOTICE-s on nested arrays */
	static arrayDiffTree($arr1, $arr2) {
		let $result, $key, $val1, $val2, $diff;
		$result = [];
		for ([$key, $val1] of Object.entries($arr1)) {
			if (php.array_key_exists($key, $arr2)) {
				$val2 = $arr2[$key];
				if (php.is_array($val1) && php.is_array($val2)) {
					$diff = this.arrayDiffTree($val1, $val2);
					if (php.count($diff) > 0) {
						$result[$key] = $diff;
					}
				} else if ($val1 != $val2) {
					$result[$key] = $val1;
				}
			} else {
				$result[$key] = $val1;
			}
		}
		return $result;
	}

	/** @param $cmdData = CommandParser::parseFareSearch()
	 * @param $session = await require('StatefulSession.js')() */
	async execute($cmd, $session) {
		let $sessionData, $rpcParamRecord,
			$timeout, $hasFares, $cmdRecord;
		$sessionData = {...$session.getSessionData(), gds: $session.gds};
		if (!$session.getAgent().canUseMultiPccTariffDisplay()) {
			return {'errors': ['You are not allowed to use \/MIX alias']};
		}
		$rpcParamRecord = await this.makeRpcParamOptions($cmd, $sessionData);
		if (!php.empty($rpcParamRecord['error'])) {
			return {'errors': ['Failed to generate RPC params - ' + $rpcParamRecord['error']]};
		}
		let promises = [];
		for (let $rpcParams of Object.values($rpcParamRecord['options'])) {
			let $pccParams = this.constructor.arrayDiffTree($rpcParams, $rpcParamRecord['baseParams']);
			let whenTariff = RbsClient.getTariffDisplay($rpcParams)
				.then(serviceRs => ({
					pcc: $rpcParams.pcc,
					gds: $rpcParams.gds,
					jobResult: serviceRs.result,
				}));

			whenTariff.then(result => $session.logit('Got a /MIX job result', {$pccParams, result}));
			whenTariff = timeout(this.constructor.TIMEOUT, whenTariff)
				.catch(exc => {
					$session.logExc('WARNING: /MIX job failed for PCC ' + $rpcParams.pcc, exc);
					exc.message = $rpcParams.pcc + ': ' + exc.message;
					return Promise.reject(exc);
				});
			promises.push(whenTariff);
		}
		this.log('Started ' + php.count(promises) + ' jobs: ' + php.implode(', ', php.array_column(promises, 'pcc')), promises);
		$timeout = this.constructor.TIMEOUT;
		let wrap = await allWrap(promises);
		let $finishedJobs = wrap.resolved;
		let errors = wrap.rejected.map(exc => (exc + '').slice(0, 90) + '...');
		this.logFinishedJobs($finishedJobs, promises);

		$hasFares = ($job) => !php.empty($job['jobResult']['result']['fares']);
		if (!Fp.any($hasFares, $finishedJobs)) {
			let formatted = php.array_map(a => this.constructor.formatJobError(a), $finishedJobs);
			formatted.push(...errors);
			return {'errors': formatted.length > 0 ? formatted : ['None of PCC jobs responded']};
		}
		if (!php.empty($finishedJobs)) {
			$cmdRecord = (new MakeMultiPccTariffDumpAction()).execute($finishedJobs, $sessionData, $rpcParamRecord['cmdData']);
			return {'calledCommands': [$cmdRecord], userMessages: errors};
		} else {
			return {'errors': ['All ' + php.count(promises) + ' PCC jobs failed'].concat(errors)};
		}
	}
}

// 5 - for debug
GetMultiPccTariffDisplayAction.TIMEOUT = 20.000;

module.exports = GetMultiPccTariffDisplayAction;
