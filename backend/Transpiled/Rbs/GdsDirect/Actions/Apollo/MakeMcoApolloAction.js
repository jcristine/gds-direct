

const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const ApolloMakeMcoAction = require('../../../../Rbs/GdsAction/ApolloMakeMcoAction.js');
const ApolloPnr = require('../../../../Rbs/TravelDs/ApolloPnr.js');
const Airlines = require("../../../../../Repositories/Airlines");
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const fetchAll = require("../../../../../GdsHelpers/TravelportUtils").fetchAll;
const McoListParser = require('gds-utils/src/text_format_processing/apollo/McoListParser.js');
const McoMaskParser = require('gds-utils/src/text_format_processing/apollo/ticketing_masks/McoMaskParser.js');
const Rej = require('klesun-node-tools/src/Rej.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * get current PNR data, ApolloMakeMcoAction and format output
 * if you accidentally pass ISSUE NOW Y, command to cancel document is RRVO/0805056180981/01MAR
 */
class MakeMcoApolloAction extends AbstractGdsAction
{
	static async getMcoParams(pnr, mcoMask)  {
		const validatingCarrier = pnr.getValidatingCarrier();
		const hub = await Airlines.findByCode(validatingCarrier)
			.then(r => r.hub).catch(() => null);
		if (!validatingCarrier) {
			return Rej.BadRequest('Validating carrier must be present in ATFQ');
		}
		const match = mcoMask.match(/^\s*(SIMULTANEOUS CHANGES\/IGNORE)\s*(><)?$/);
		if (match) {
			return Rej.Conflict(match[1], {isOk: true});
		}
		const storedParams = McoMaskParser.parse(mcoMask);
		if (storedParams.error) {
			return Rej.UnprocessableEntity('Failed to parse MCO mask - ' + storedParams.error);
		}
		let fop = storedParams.formOfPayment.raw;
		const expirationDate = (storedParams.expirationYear && storedParams.expirationMonth)
			? '20' + storedParams.expirationYear + '-' + storedParams.expirationMonth + '-01'
			: null;
		if (!fop || !expirationDate || !storedParams.approvalCode) {
			return Rej.BadRequest('Approved FOP must be present');
		}
		if (!StringUtil.endsWith(fop, '/OK')) {
			fop += '/OK';
		}
		return Promise.resolve({
			validatingCarrier, hub, fop, expirationDate,
			approvalCode: storedParams.approvalCode || null,
		});
	}

	async getPnrMcoData()  {
		let $pnr, $mcoMask;
		const pnrDump = (await fetchAll('*R', this)).output;
		$pnr = ApolloPnr.makeFromDump(pnrDump);
		if (!$pnr.getRecordLocator()) {
			return Rej.BadRequest('Must be in a PNR');
		}
		$mcoMask = (await fetchAll('HHMCO', this)).output;
		return this.constructor.getMcoParams($pnr, $mcoMask);
	}

	async getCurrentMcoCount()  {
		let $mcoList;
		$mcoList = (await fetchAll('*MPD', this)).output;
		$mcoList = McoListParser.parse($mcoList);
		return php.count($mcoList['mcoRows'] || []);
	}

	async prepareParams($userParams)  {
		let $defaultParams, $pnrParams, $paramsFromPnr, $paramsFromUser;
		$defaultParams = ApolloMakeMcoAction.getDefaultParams();
		$pnrParams = await this.getPnrMcoData();
		if ($pnrParams['errors'] || null) {
			return $pnrParams;
		}
		$paramsFromPnr = {
			validatingCarrier: $pnrParams['validatingCarrier'],
			to: $pnrParams['validatingCarrier'],
			at: $pnrParams['hub'],
			formOfPayment: $pnrParams['fop'],
			expirationDate: $pnrParams['expirationDate'],
			approvalCode: $pnrParams['approvalCode'],
		};
		$paramsFromUser = {
			mcoNumber: (await this.getCurrentMcoCount()) + 1,
			passengerName: $userParams['passengerName'],
			amount: $userParams['amount'],
			amountCurrency: $userParams['amountCurrency'],
			issueNow: $userParams['issueNow'],
		};
		return php.array_merge($defaultParams, $paramsFromPnr, $paramsFromUser);
	}

	async execute($userParams)  {
		let $params, $mcoResult;
		$params = await this.prepareParams($userParams);
		$mcoResult = await new ApolloMakeMcoAction()
			.setSession(this.session)
			.execute($params);
		if ($mcoResult['success'] || false) {
			return {
				calledCommands: [{
					cmd: 'HHMCU',
					output: $mcoResult['response'],
				}],
			};
		} else {
			const lastLine = $mcoResult['response'].trimEnd().replace(/[\s\S]*\n/, '');
			const msg = 'Failed to issue MCO: ' + lastLine;
			if (lastLine.trim().startsWith('MISSING - ') ||
                lastLine.trim().startsWith('INVALID FORMAT -')
			) {
				return Rej.BadRequest(msg);
			} else {
				return Rej.UnprocessableEntity(msg);
			}
		}
	}
}
module.exports = MakeMcoApolloAction;
