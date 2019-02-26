// namespace Rbs\GdsDirect;
const Fp = require('../../Lib/Utils/Fp.js');
const CmsApolloTerminal = require('../../Rbs/GdsDirect/GdsInterface/CmsApolloTerminal.js');
const SessionStateHelper = require('../../Rbs/GdsDirect/SessionStateProcessor/SessionStateHelper.js');

/**
 * this class provides implementation for
 * each function in the RPC controller
 */
class GdsDirect {
	constructor() {

	}

	static makeGdsInterface($gds) {
		if ($gds === 'apollo') {
			return new CmsApolloTerminal();
		} else {
			throw new Error('Unsupported GDS - ' + $gds);
		}
	}

	static makeGdsSession($gds, $token) {
		if ($gds === 'apollo') {
			throw new Error('Unsupported GDS - ' + $gds);
		} else {
			throw new Error('Unsupported GDS - ' + $gds);
		}
	}

	static getSupportedGdsNames() {
		return ['apollo', 'sabre', 'amadeus', 'galileo'];
	}

	static sendPqToPqt($sessionData, $result) {
		let $pnrDump, $pricingDump, $pricingCommand, $linearFareDump;
		$pnrDump = $result['pnrData']['reservation']['raw'];
		$pricingDump = $result['adultPricingInfoForPqt']['pricingDump'] || $result['pnrData']['currentPricing']['raw'];
		$pricingCommand = $result['adultPricingInfoForPqt']['pricingCmd'] || $result['pnrData']['currentPricing']['cmd'];
		$linearFareDump = $result['adultPricingInfoForPqt']['linearFareDump'] || null;
		// TODO: ...
		$result = PriceQuoteTool.addPriceQuoteFromDumps({
			'gds': $sessionData['gds'],
			'pcc': $sessionData['pcc'],
			'agentId': $sessionData['agent_id'],
			'leadId': $sessionData['lead_id'],
			'source': 'GDS_DIRECT_PQ',
			'creationDate': php.date('Y-m-d H:i:s'),
			'pricingCommand': $pricingCommand,
			'pnrDump': $pnrDump,
			'pricingDump': $pricingDump,
			'projectName': $sessionData['project_name'] || null,
			'leadUrl': $sessionData['lead_url'] || null,
			'linearFareDump': $linearFareDump,
		});
	}

	static success($result) {
		return {
			'response_code': 1,
			'result': $result,
			'errors': [],
		};
	}

	static cannotSatisfy($status, $sessionInfo, $messages, $logId) {
		return {
			'response_code': 3,
			'result': {
				'status': $status,
				'sessionInfo': $sessionInfo,
				'messages': Fp.map(($msg) => {
					return {
						'type': GdsDirect.MSG_POP_UP,
						'text': $msg,
					};
				}, $messages),
				// should be removed when CMS stops using it
				'userMessages': $messages,
			},
			'errors': [],
			'sessionLogId': $logId,
		};
	}

	static makeForbiddenReturn($cmdLog, $errors) {
		let $sessionInfo;
		$sessionInfo = SessionStateHelper.makeSessionInfo($cmdLog, []);
		return this.cannotSatisfy(GdsDirect.STATUS_FORBIDDEN, $sessionInfo, $errors);
	}
}

GdsDirect.STATUS_EXECUTED = 'executed';
GdsDirect.STATUS_FORBIDDEN = 'forbidden';
GdsDirect.STATUS_SESSION_EXPIRED = 'sessionExpired';
GdsDirect.STATUS_SESSION_LIMIT_REACHED = 'sessionLimitReached';
GdsDirect.MSG_CONSOLE_INFO = 'console_info';
GdsDirect.MSG_CONSOLE_ERROR = 'console_error';
GdsDirect.MSG_POP_UP = 'pop_up';
GdsDirect.GDS_APOLLO = 'apollo';
GdsDirect.GDS_SABRE = 'sabre';


module.exports = GdsDirect;
