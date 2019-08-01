

const AtfqParser = require('../../../../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const BaggageAllowanceParser = require('../../../../../Gds/Parsers/Apollo/BaggageAllowanceParser/BaggageAllowanceParser.js');
const BaggageAllowanceParserDataStructureWriter = require('../../../../../Gds/Parsers/Apollo/BaggageAllowanceParser/BaggageAllowanceParserDataStructureWriter.js');
const php = require('../../../../../phpDeprecated');

class PricingStructureWriter
{
	static make()  {
		return new this();
	}

	constructor()  {
		this.$currentPricingBlock = {};
		this.$baggageInfoLines = [];
		this.$dataStructure = {
			'wholePricingMarkers': {
				'fareGuaranteedAtTicketIssuance': false,
				'fareHasPlatingCarrierRestriction': false,
				'agentSelectedFareUsed': false,
				'eTicketRequired': false,
			},
			'pricingBlockList': [],
		};
	}

	saveCurrentPricingBlock()  {
		let $baggageDump, $dataStructureWriter, $e;
		if (this.$baggageInfoLines.length > 0) {
			this.$currentPricingBlock['baggageInfo'] = this.$currentPricingBlock['baggageInfo'] || {};
			this.$currentPricingBlock['baggageInfo']['raw'] = php.implode('', this.$baggageInfoLines);

			try {
				$baggageDump = this.$currentPricingBlock['baggageInfo']['raw'];
				$dataStructureWriter = BaggageAllowanceParserDataStructureWriter.make();
				this.$currentPricingBlock['baggageInfo']['parsed'] = BaggageAllowanceParser.parse($baggageDump, $dataStructureWriter);
			} catch ($e) {
				this.$currentPricingBlock['baggageInfo']['parsed'] = null;
			}

			this.$baggageInfoLines = [];
		}
		this.$dataStructure['pricingBlockList'].push(this.$currentPricingBlock);
	}

	makeNewPricingBlock()  {
		if (!php.empty(this.$currentPricingBlock)) {
			this.saveCurrentPricingBlock();
		}
		this.$currentPricingBlock = {
			'baggageInfo': {'raw': '', 'parsed': null},
			'defaultPlatingCarrier': null,
			'fareConstruction': null,
			'lastDateToPurchaseTicket': null,
			'notValidBA': [],
			'passengerNumbers': null,
			'penaltyApplies': false,
			'ticketingAgencyPcc': null,
			'tourCode': null,
			'privateFaresSelected': false,
			'bankSellingRate': null,
			'bsrCurrencyFrom': null,
			'bsrCurrencyTo': null,
		};
	}

	// --------------------------------------------------

	commandCopyLineFound($res)  {
		this.$dataStructure['pricingCommandCopy'] = this.$dataStructure['pricingCommandCopy'] || '';
		this.$dataStructure['pricingCommandCopy'] += $res['line'];
		this.$dataStructure['parsedPricingCommand'] = AtfqParser.parsePricingCommand(php.substr(this.$dataStructure['pricingCommandCopy'], 1));
	}
	eTicketRequiredStatementFound($res)  {
		this.$dataStructure['wholePricingMarkers']['eTicketRequired'] = true;
	}
	paperTicketRequiredStatementFound()  {
		this.$dataStructure['wholePricingMarkers']['paperTicketRequired'] = true;
	}
	fareGuaranteedAtTicketIssuanceStatementFound($res)  {
		this.$dataStructure['wholePricingMarkers']['fareGuaranteedAtTicketIssuance'] = true;
	}
	fareHasPlatingCarrierRestrictionStatementFound($res)  {
		this.$dataStructure['wholePricingMarkers']['fareHasPlatingCarrierRestriction'] = true;
	}
	fareHasFormOfPaymentRestrictionStatementFound($res)  {
		this.$dataStructure['wholePricingMarkers']['fareHasFormOfPaymentRestriction'] = true;
	}
	agentSelectedFareUsedStatementFound($res)  {
		this.$dataStructure['wholePricingMarkers']['agentSelectedFareUsed'] = true;
	}

	// --------------------------------------------------

	additionalServicesStatementFound($res)  {
		if (php.array_key_exists('makeNewPricingBlock', $res) && $res['makeNewPricingBlock']) {
			this.makeNewPricingBlock();
		}
		this.$currentPricingBlock['carrierMayOfferAdditionalServices'] = true;
	}

	penaltyAppliesStatementFound($res)  {
		if (php.array_key_exists('makeNewPricingBlock', $res) && $res['makeNewPricingBlock']) {
			this.makeNewPricingBlock();
		}
		this.$currentPricingBlock['penaltyApplies'] = true;
	}

	privateFaresSelectedStatementFound($res)  {
		if (php.array_key_exists('makeNewPricingBlock', $res) && $res['makeNewPricingBlock']) {
			this.makeNewPricingBlock();
		}
		this.$currentPricingBlock['privateFaresSelected'] = true;
	}

	bankSellingRateFound($res)  {
		if (php.array_key_exists('makeNewPricingBlock', $res) && $res['makeNewPricingBlock']) {
			this.makeNewPricingBlock();
		}
		this.$currentPricingBlock['bankSellingRate'] = $res['bankSellingRate'];
		this.$currentPricingBlock['bsrCurrencyFrom'] = $res['bsrCurrencyFrom'];
		this.$currentPricingBlock['bsrCurrencyTo']   = $res['bsrCurrencyTo'];
	}

	unknownPricingStatementLineFound($res)  {
		if (php.array_key_exists('makeNewPricingBlock', $res) && $res['makeNewPricingBlock']) {
			this.makeNewPricingBlock();
		}
	}

	unparsedInfoLineFound($line)  {
		this.$currentPricingBlock['unparsedInfoLines'] = this.$currentPricingBlock['unparsedInfoLines'] || [];
		this.$currentPricingBlock['unparsedInfoLines'].push($line);
	}

	lastDateToPurchaseTicketFound($res)  {
		if (php.array_key_exists('makeNewPricingBlock', $res) && $res['makeNewPricingBlock']) {
			this.makeNewPricingBlock();
		}
		this.$currentPricingBlock['lastDateToPurchaseTicket'] = $res['date'];
	}

	fareConstructionMarkerLineFound($res)  {
		if (php.array_key_exists('makeNewPricingBlock', $res) && $res['makeNewPricingBlock']) {
			this.makeNewPricingBlock();
		}
		this.$currentPricingBlock['passengerNumbers'] = $res['passengerNumbers'];
	}

	// --------------------------------------------------

	/** @param $res = NextToken::matchFareConstructionBlock() */
	fareConstructionFound($res)  {
		this.$currentPricingBlock['fareConstruction'] = $res['fareConstruction'];
		delete(this.$currentPricingBlock['fareConstruction']['textLeft']);
	}

	notValidBeforeOrAfterLineFound($res)  {
		this.$currentPricingBlock['notValidBA'] = this.$currentPricingBlock['notValidBA'] || [];
		this.$currentPricingBlock['notValidBA'].push({
			'number': $res['number'],
			'notValidBefore': $res['notValidBefore'],
			'notValidAfter': $res['notValidAfter'],
		});
	}

	endorsementBoxLineFound($res)  {
		this.$currentPricingBlock['endorsementBoxLine'] = this.$currentPricingBlock['endorsementBoxLine'] || [];
		this.$currentPricingBlock['endorsementBoxLine'].push($res['endorsementBox']);
	}

	ticketingAgencyLineFound($res)  {
		this.$currentPricingBlock['ticketingAgencyPcc'] = $res['pcc'];
	}

	tourCodeLineFound($res)  {
		this.$currentPricingBlock['tourCode'] = $res['tourCode'];
	}

	defaultPlatingCarrierLineFound($res)  {
		this.$currentPricingBlock['defaultPlatingCarrier'] = $res['airline'];
	}

	taxesLineFound($res)  {

	}

	baggageAllowanceBlockStartLineFound($res)  {
		this.$baggageInfoLines.push($res['line']);
	}

	passengerTypeCodeLineFound($res)  {
		this.$baggageInfoLines.push($res['line']);
	}

	baggageInfoLineFound($res)  {
		this.$baggageInfoLines.push($res['line']);
	}

	rebookStatementFound($res) {
		let segments = $res.segments || [];
		for (let ptcRecord of $res.ptcRecords || []) {
			for (let segment of ptcRecord.segments) {
				segments.push({...segment, ptc: ptcRecord.ptc});
			}
		}
		this.$dataStructure['wholePricingMarkers']['rebookSegments'] = segments;
	}

	// --------------------------------------------------

	getStructure()  {
		if (this.$currentPricingBlock) {
			this.saveCurrentPricingBlock();
		}
		return this.$dataStructure;
	}
}
module.exports = PricingStructureWriter;
