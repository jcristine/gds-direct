const MultiPccTariffRules = require('../../../../../Repositories/MultiPccTariffRules.js');

const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const LocationGeographyProvider = require('../../../../Rbs/DataProviders/LocationGeographyProvider.js');
const RbsClient = require("../../../../../IqClients/RbsClient");
const NormalizeTariffCmd = require('../../../../../Actions/CmdTranslators/NormalizeTariffCmd.js');
const MakeMultiPccTariffDumpAction = require('./MakeMultiPccTariffDumpAction.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
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

	async getPccs(cmdData, sessionData) {
		return MultiPccTariffRules.getMatchingPccs({
			departureAirport: cmdData.departureAirport,
			destinationAirport: cmdData.destinationAirport,
			gds: sessionData.gds,
			pcc: sessionData.pcc,
			repricePccRules: this.$repriceRules,
			geoProvider: this.$geoProvider,
		});
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
		const promises = [];
		for (const $rpcParams of Object.values($rpcParamRecord['options'])) {
			const $pccParams = this.constructor.arrayDiffTree($rpcParams, $rpcParamRecord['baseParams']);
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
		const wrap = await allWrap(promises);
		const $finishedJobs = wrap.resolved;
		const errors = wrap.rejected.map(exc => (exc + '').slice(0, 90) + '...');
		this.logFinishedJobs($finishedJobs, promises);

		$hasFares = ($job) => !php.empty($job['jobResult']['result']['fares']);
		if (!Fp.any($hasFares, $finishedJobs)) {
			const formatted = php.array_map(a => this.constructor.formatJobError(a), $finishedJobs);
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
