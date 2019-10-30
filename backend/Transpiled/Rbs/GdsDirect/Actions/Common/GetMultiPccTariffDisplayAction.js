const Normalize_fareSearch = require('gds-utils/src/cmd_translators/Normalize_fareSearch.js');
const FluentLogger = require('../../../../../LibWrappers/FluentLogger.js');
const Rej = require('klesun-node-tools/src/Rej.js');
const MultiPccTariffRules = require('../../../../../Repositories/MultiPccTariffRules.js');
const _ = require('lodash');

const LocationGeographyProvider = require('../../../../Rbs/DataProviders/LocationGeographyProvider.js');
const RbsClient = require("../../../../../IqClients/RbsClient");
const MakeMultiPccTariffDumpAction = require('./MakeMultiPccTariffDumpAction.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');
const {allWrap, timeout} = require('klesun-node-tools/src/Lang.js');

/**
 * schedule multiple async jobs that fetch tariff displays in different PCC-s
 * wait for them to finish and return all fares from all PCC-s in one dump
 */
class GetMultiPccTariffDisplayAction {
	constructor() {
		this.repriceRules = null;
		this.geoProvider = new LocationGeographyProvider();
		this.baseDate = php.date('Y-m-d H:i:s');
	}

	log(msg, data) {
		// should implement probably...
		return this;
	}

	setGeoProvider($geoProvider) {
		this.geoProvider = $geoProvider;
		return this;
	}

	setBaseDate($baseDate) {
		this.baseDate = $baseDate;
		return this;
	}

	setRepriceRules(rules) {
		this.repriceRules = rules;
		return this;
	}

	async getPccs(cmdData, sessionData) {
		return MultiPccTariffRules.getMatchingPccs({
			departureAirport: cmdData.departureAirport,
			destinationAirport: cmdData.destinationAirport,
			gds: sessionData.gds,
			pcc: sessionData.pcc,
			repricePccRules: this.repriceRules,
			geoProvider: this.geoProvider,
		});
	}

	static extendFromPccRecord(rpcParams, pccRec, sessionData) {
		rpcParams = {...rpcParams};
		if (pccRec.gds !== sessionData.gds) {
			delete rpcParams.ptc;
			delete rpcParams.accountCode;
		}
		if (rpcParams.fareType) {
			const isTp = ['apollo', 'galileo'].includes(pccRec.gds);
			rpcParams.fareType = {
				published: 'published',
				private: 'private',
				agency_private: isTp ? 'agency_private' : undefined,
				airline_private: isTp ? 'airline_private' : 'private',
				net_private: isTp ? 'net_private' : undefined,
			}[rpcParams.fareType];
		}
		rpcParams.pcc = pccRec.pcc;
		rpcParams.gds = pccRec.gds;
		const intersection = php.array_intersect_key(rpcParams, pccRec);
		const hasConflicts = Object.entries(intersection)
			.some(([k,v]) => v != pccRec[k]);
		if (!hasConflicts) {
			rpcParams = php.array_merge(rpcParams, pccRec);
		}
		return rpcParams;
	}

	static transformFareType($inParserFormat) {
		let $inRpcFormat;
		$inRpcFormat = {
			public: 'published',
			private: 'private',
			agencyPrivate: 'agency_private',
			airlinePrivate: 'airline_private',
			netAirlinePrivate: 'net_private',
		}[$inParserFormat] || null;
		return $inRpcFormat;
	}

	async makeRpcParamOptions(cmd, sessionData) {
		const cmdData = Normalize_fareSearch({cmd,
			gds: sessionData.gds,
			baseDate: this.baseDate,
		});
		if (!cmdData) {
			const msg = 'Failed to parse your command - ' + cmd;
			return Rej.NotImplemented(msg);
		} else if (cmdData.unparsed) {
			const msg = 'Failed to parse some tariff modifiers - ' + cmdData.unparsed;
			return Rej.NotImplemented(msg);
		} else if (!cmdData.departureAirport) {
			return Rej.BadRequest('Departure airport must be specified');
		} else if (!cmdData.destinationAirport) {
			return Rej.BadRequest('Destination airport must be specified');
		} else if (!cmdData.departureDate) {
			return Rej.BadRequest('Invalid departure date');
		}
		const departureDate = (cmdData.departureDate || {}).full;
		const returnDate = (cmdData.returnDate || {}).full;
		const baseParams = {
			maxFares: 40,
			timeout: this.constructor.TIMEOUT * 2 / 3,
			departureDate: departureDate,
			returnDate: returnDate,
			departureAirport: cmdData.departureAirport,
			destinationAirport: cmdData.destinationAirport,
		};
		for (const [type, data] of Object.entries(cmdData.typeToData)) {
			if (type === 'airlines') {
				baseParams.airlines = data;
			} else if (type === 'tripType') {
				baseParams.tripType = data;
			} else if (type === 'ptc') {
				baseParams.ptc = data;
			} else if (type === 'cabinClass') {
				baseParams.cabinClass = data;
			} else if (type === 'fareType') {
				baseParams.fareType = this.constructor.transformFareType(data);
			} else if (type === 'accountCode') {
				baseParams.accountCode = data;
			} else if (type === 'bookingClass') {
				baseParams.bookingClass = data;
			} else if (type === 'fareBasis') {
				baseParams.fareBasis = data;
			} else if (type === 'currency') {
				baseParams.currency = data;
			} else {
				return Rej.NotImplemented('Unsupported modifier - ' + type);
			}
		}
		let options = [];
		const pccRecs = await this.getPccs(cmdData, sessionData);
		for (const pccRec of pccRecs) {
			options.push(this.constructor.extendFromPccRecord(baseParams, pccRec, sessionData));
		}
		options = _.uniqBy(options, r => JSON.stringify(r));
		return Promise.resolve({baseParams, options, cmdData});
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
	 * @param stateful = await require('StatefulSession.js')() */
	async execute(cmd, stateful) {
		const cmdRqId = await stateful.getLog().getCmdRqId();
		const sessionData = {...stateful.getSessionData(), gds: stateful.gds};
		if (!stateful.getAgent().canUseMultiPccTariffDisplay()) {
			return Rej.Forbidden('You are not allowed to use /MIX alias');
		}
		const rpcParamRecord = await this.makeRpcParamOptions(cmd, sessionData);
		const promises = [];
		for (const rpcParams of Object.values(rpcParamRecord['options'])) {
			let whenTariff = RbsClient.getTariffDisplay(rpcParams)
				.then(serviceRs => ({
					pcc: rpcParams.pcc,
					gds: rpcParams.gds,
					rpcParams: rpcParams,
					jobResult: serviceRs.result,
				}));

			whenTariff.then(result => {
				const pccParams = this.constructor.arrayDiffTree(rpcParams, rpcParamRecord['baseParams']);
				const logId = stateful.getSessionRecord().logId;
				FluentLogger.logit('Got a /MIX job result', logId, {pccParams, result});
				return stateful.askClient({
					messageType: 'displayTariffMixPccRow',
					cmdRqId: cmdRqId,
					pccResult: result,
				});
			}).catch(() => {});
			whenTariff = timeout(this.constructor.TIMEOUT, whenTariff)
				.catch(exc => {
					stateful.logExc('WARNING: /MIX job failed for PCC ' + rpcParams.pcc, exc);
					exc.message = rpcParams.pcc + ': ' + exc.message;
					return Promise.reject(exc);
				});
			promises.push(whenTariff);
		}
		this.log('Started ' + php.count(promises) + ' jobs: ' + php.implode(', ', php.array_column(promises, 'pcc')), promises);
		const wrap = await allWrap(promises);
		const finishedJobs = wrap.resolved;
		const errors = wrap.rejected.map(exc => (exc + '').slice(0, 90) + '...');
		this.logFinishedJobs(finishedJobs, promises);

		const hasFares = ($job) => !php.empty($job.jobResult.result.fares);
		if (!finishedJobs.some(hasFares)) {
			const formatted = php.array_map(a => this.constructor.formatJobError(a), finishedJobs);
			formatted.push(...errors);
			return {errors: formatted.length > 0 ? formatted : ['None of PCC jobs responded']};
		}
		const actions = [{type: 'finalizeTariffMix', data: {cmdRqId}}];
		if (!php.empty(finishedJobs)) {
			const cmdRecord = (new MakeMultiPccTariffDumpAction())
				.execute(finishedJobs, sessionData, rpcParamRecord.cmdData);
			return {actions, calledCommands: [cmdRecord], userMessages: errors};
		} else {
			return {actions, errors: ['All ' + php.count(promises) + ' PCC jobs failed'].concat(errors)};
		}
	}
}

// 5 - for debug
GetMultiPccTariffDisplayAction.TIMEOUT = 20.000;

module.exports = GetMultiPccTariffDisplayAction;
