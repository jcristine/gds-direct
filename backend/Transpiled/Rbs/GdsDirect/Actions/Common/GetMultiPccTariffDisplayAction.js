
const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const LocationGeographyProvider = require('../../../../Rbs/DataProviders/LocationGeographyProvider.js');
const RbsClient = require("../../../../../IqClients/RbsClient");
const NormalizeTariffCmd = require('./NormalizeTariffCmd.js');
const MakeMultiPccTariffDumpAction = require('./MakeMultiPccTariffDumpAction.js');

let php = require('klesun-node-tools/src/Transpiled/php.js');
const {allWrap} = require('klesun-node-tools/src/Lang.js');
const {timeout} = require("../../../../../Utils/TmpLib");

/**
 * schedule multiple async jobs that fetch tariff displays in different PCC-s
 * wait for them to finish and return all fares from all PCC-s in one dump
 */
class GetMultiPccTariffDisplayAction {
	constructor() {
		this.$repriceRules = null;
		this.$log = ($msg, $data) => {};
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
			let serviceRs = await RbsClient.getMultiPccTariffRules();
			let apiData = serviceRs.result.result;
			this.$repriceRules = apiData.records;
		}
		return Promise.resolve(this.$repriceRules);
	}

	static async _matchesLocationItem($airport, $item, $geo) {
		if ($item['type'] === 'airport') {
			return $item['value'] === $airport;
		} else if ($item['type'] === 'city') {
			return $geo.doesBelongToCity($airport, $item['value']);
		} else if ($item['type'] === 'country') {
			return $item['value'] === await $geo.getCountryCode($airport);
		} else if ($item['type'] === 'region') {
			return $item['value'] == await $geo.getRegionId($airport);
		} else {
			return false;
		}
	}

	static async matchesLocation($airport, $locationItems, $geo) {
		if (php.empty($locationItems)) {
			return true;
		}
		for (let $item of $locationItems) {
			if (await this._matchesLocationItem($airport, $item, $geo)) {
				return true;
			}
		}
		return false;
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
	async getRoutePccs($depAirport, $destAirport, $rules) {
		let $rule, $geo;
		for ($rule of Object.values($rules)) {
			$geo = this.$geoProvider;
			if (await this.constructor.matchesLocation($depAirport, $rule['departure_items'], $geo) &&
				await this.constructor.matchesLocation($destAirport, $rule['destination_items'], $geo)
			) {
				return php.array_map(a => this.constructor.transformPccRecordFromDb(a), $rule['reprice_pcc_records']);
			}
		}
		return [];
	}

	async getPccs($cmdData, $sessionData) {
		let $routeRules, $fallbackPccs, $rules, $rule, $pccs, $isCurrent;
		$routeRules = [];
		$fallbackPccs = [];
		$rules = await this.getRepriceRules();
		for ($rule of Object.values($rules)) {
			if (!php.empty($rule['departure_items']) ||
				!php.empty($rule['destination_items'])
			) {
				$routeRules.push($rule);
			} else {
				$fallbackPccs = $rule['reprice_pcc_records']
					.map(r => this.constructor.transformPccRecordFromDb(r));
			}
		}
		let pccsFromRules = php.array_merge(
			await this.getRoutePccs($cmdData['departureAirport'], $cmdData['destinationAirport'], $routeRules),
			await this.getRoutePccs($cmdData['destinationAirport'], $cmdData['departureAirport'], $routeRules),
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
		$unfinished = $startedJobs.filter(($started) =>
			!php.in_array($started['jobId'], $finishedIds));
		if (!php.empty($unfinished)) {
			this.log('WARNING: Got ' + php.count($unfinished) + ' undone jobs: ' +
				php.implode(', ', php.array_column($unfinished, 'pcc')), $unfinished);
		}
		RbsClient.reportMultiPccTariffResult({
			jobsStarted: $startedJobs.length,
			jobs: $finishedJobs.map(j => ({
				params: j.rpcParams,
				result: j.jobResult.result,
			})).filter(j => j.result),
		});
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
					rpcParams: $rpcParams,
					jobResult: serviceRs.result,
				}));

			whenTariff.then(result => $session.logit('Got a /MIX job result', {$pccParams, result})).catch(() => {});
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
