

const AbstractMaskParser = require('../../Gds/Parsers/Apollo/AbstractMaskParser.js');
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const Fp = require('../../Lib/Utils/Fp.js');
const AbstractGdsAction = require('./AbstractGdsAction.js');
const fetchAll = require("../../../GdsHelpers/TravelportUtils").fetchAll;

const php = require('../../phpDeprecated.js');

// Assumes PNR is already open
class ApolloMakeMcoAction extends AbstractGdsAction
{
	static getMask()  {
		return php.implode('', [
			'HHMCU..         *** MISC CHARGE ORDER ***                      ',
			' PASSENGER NAME;........................................        ',
			' TO;........................................ AT;............... ',
			' VALID FOR;.................................................... ',
			' TOUR CODE;............... RELATED TKT NBR;.............        ',
			' FOP;.......................................................... ',
			' EXP DATE;.... APVL CODE;...... COMM;........ TAX;........-;..  ',
			' AMOUNT;........-;... EQUIV ;........-;... BSR;..........       ',
			' END BOX;...................................................... ',
			' REMARK1;..............................................         ',
			' REMARK2;...................................................... ',
			' VALIDATING CARRIER;..                  ISSUE NOW;.',
		]);
	}

	static getFields()  {
		return [
			'mcoNumber',
			'passengerName',
			'to', 'at',
			'validFor',
			'tourCode', 'ticketNumber',
			'formOfPayment',
			'expirationDate', 'approvalCode', 'commission', 'taxAmount', 'taxCode',
			'amount', 'amountCurrency', 'equivAmount', 'equivCurrency', 'rateOfExchange',
			'endorsementBox',
			'remark1',
			'remark2',
			'validatingCarrier', 'issueNow',
		];
	}

	static getDefaultParams()  {
		return {
			'validFor': 'SPLIT',
			'tourCode': '',
			'ticketNumber': '',
			'commission': '0.00/',
			'taxAmount': '',
			'taxCode': '',
			'equivAmount': '',
			'equivCurrency': '',
			'rateOfExchange': '',
			'endorsementBox': '',
			'remark1': '',
			'remark2': '',
			'issueNow': 'Y',
		};
	}

	static async makeCmd($params)  {
		$params = php.array_merge(this.getDefaultParams(), $params);
		$params['expirationDate'] = php.date('my', php.strtotime($params['expirationDate']));
		return AbstractMaskParser.makeCmdFromEmptyMask({
			emptyMask: this.getMask(),
			destinationMask: this.getMask(),
			fields: this.getFields(),
			values: $params,
		});
	}

	async execute($params)  {
		let $cmd, $result;
		$cmd = await this.constructor.makeCmd($params);
		$result = (await fetchAll($cmd, this)).output;
		return {
			'success': StringUtil.startsWith($result, 'MCO ISSUED')
                    || StringUtil.startsWith($result, 'EXISTING MCO UPDATED')
                    || StringUtil.startsWith($result, 'MCO DATA STORED'),
			'response': $result,
		};
	}
}
module.exports = ApolloMakeMcoAction;
