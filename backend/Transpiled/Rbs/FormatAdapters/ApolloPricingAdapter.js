
// namespace Rbs\FormatAdapters;

const Fp = require('../../Lib/Utils/Fp.js');
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const AtfqParser = require('../../Gds/Parsers/Apollo/Pnr/AtfqParser.js');
const ApolloPricingModifierHelper = require("./ApolloPricingModifierHelper");
const ApolloBaggageAdapter = require("./ApolloBaggageAdapter");

let php = require('../../phpDeprecated.js');

/**
 * transforms output of PricingParser::parse() to a common format
 */
class ApolloPricingAdapter
{
    constructor() {
		this.$pricingCommand = null;
		this.$nameRecords = null;
		this.$includeBaggageInfo = false;
	}

    includeBaggageInfo($flag)  {
        this.$includeBaggageInfo = $flag;
        return this;
    }

    setPricingCommand($cmd)  {
        this.$pricingCommand = $cmd;
        return this;
    }

    setNameRecords($nameRecords)  {
        this.$nameRecords = $nameRecords;
        return this;
    }

    /** @param $fc = FareConstructionParser::parse() */
    static transformFareInfo($fc)  {
        let $result;
        $result = {};
        $result['baseFare'] = {
            'currency': $fc['fareAndMarkup']['currency'],
            'amount': $fc['fareAndMarkup']['amount'],
        };
        delete($fc['fareAndMarkup']);
        $result['fareEquivalent'] = php.isset($fc['fareEquivalent']) ? {
            'currency': $fc['fareEquivalent']['currency'],
            'amount': $fc['fareEquivalent']['amount'],
        } : null;
        delete($fc['fareEquivalent']);
        $result['totalFare'] = {
            'currency': $fc['amountCharged']['currency'],
            'amount': $fc['amountCharged']['amount'],
        };
        delete($fc['amountCharged']);
        $result['taxList'] = Fp.map(($taxRecord) => {
            return {
                'taxCode': $taxRecord['pseudoCountryCode'],
                'amount': $taxRecord['amount'],
            };
        }, $fc['taxes']);
        delete($fc['taxes']);
        $result['fareConstruction'] = $fc;
        return $result;
    }

    /** @param $pricingBlockData = PricingParser::parse()['pricingBlockList'][0] */
    transformPtcBlock($pricingBlockData, $modsHelper)  {
        let $ptcInfo, $nameNumbers, $bagsParsed;
        let bagPtc = (((($pricingBlockData
            ['baggageInfo'] || {})
            ['parsed'] || {})
            ['baggageAllowanceBlocks'] || [])
            [0] || {})
            ['paxTypeCode'];
        $ptcInfo = $modsHelper.makeBlockPtcInfo($pricingBlockData['passengerNumbers'], bagPtc);
        $nameNumbers = $ptcInfo['nameNumbers'];
        delete($ptcInfo['nameNumbers']);
        $bagsParsed = $pricingBlockData['baggageInfo']['parsed'];
        return {
            'passengerNameNumbers': $nameNumbers,
            'ptcInfo': $ptcInfo,
            'lastDateToPurchase': php.isset($pricingBlockData['lastDateToPurchaseTicket']) ? {
                'raw': $pricingBlockData['lastDateToPurchaseTicket']['raw'],
                'parsed': $pricingBlockData['lastDateToPurchaseTicket']['parsed'],
                'full': $pricingBlockData['lastDateToPurchaseTicket']['parsed'],
            } : null,
            'lastTimeToPurchase': null,
            'validatingCarrier': $pricingBlockData['defaultPlatingCarrier']
                || $modsHelper.getMod('validatingCarrier')
                || $modsHelper.getMod('overrideCarrier'),
            'hasPrivateFaresSelectedMessage': $pricingBlockData['privateFaresSelected'] || false,
            'endorsementBoxLines': $pricingBlockData['endorsementBoxLine'] || null,
            'fareInfo': this.constructor.transformFareInfo($pricingBlockData['fareConstruction']),
            'baggageInfo': !this.$includeBaggageInfo || !$bagsParsed ? null : {
                'raw': $pricingBlockData['baggageInfo']['raw'],
                'parsed': ApolloBaggageAdapter.transformBaggageInfo($bagsParsed),
            },
            'bankSellingRate': $pricingBlockData['bankSellingRate'] || null,
            'bsrCurrencyFrom': $pricingBlockData['bsrCurrencyFrom'] || null,
            'bsrCurrencyTo': $pricingBlockData['bsrCurrencyTo'] || null
        };
    }

    makeHelper($pricing)  {
        let $mods;
        $mods = $pricing['parsedPricingCommand']['pricingModifiers'];
        if (this.$pricingCommand) {
            if (StringUtil.startsWith(this.$pricingCommand, '$BB0')) {
                // when you price with $BB0, command copy _does not_ include modifiers, but
                // when you rebook with $BBQ01 modifiers are available _only_ from command copy
                $mods = AtfqParser.parsePricingCommand(this.$pricingCommand)['pricingModifiers'];
            }
        }
        return new ApolloPricingModifierHelper($mods, this.$nameRecords || []);
    }

    /**
     * @param $pricing = PricingParser::parse()
     */
    transform($pricing)  {
        let $modsHelper, $pccs;
        $modsHelper = this.makeHelper($pricing);
        $pccs = php.array_unique(php.array_column($pricing['pricingBlockList'], 'ticketingAgencyPcc'));
        return {
            'quoteNumber': null,
            'pricingPcc': php.count($pccs) === 1 ? $pccs[0] : $modsHelper.getPricingPcc(),
            'pricingModifiers': $modsHelper.getMods(),
            'pricingBlockList': Fp.map(($block) => {
                return this.transformPtcBlock($block, $modsHelper);
            }, $pricing['pricingBlockList']),
        };
    }
}
module.exports = ApolloPricingAdapter;
