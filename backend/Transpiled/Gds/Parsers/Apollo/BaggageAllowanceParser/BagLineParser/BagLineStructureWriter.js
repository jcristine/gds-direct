

let php = require('../../../../../phpDeprecated');

class BagLineStructureWriter
{
    static make()  {
        return new this();
    }

    constructor()  {
        this.$data = {
            'bagDescription': null,
            'bagNumber': null,
            'feeAmount': null,
            'feeCurrency': null,
            'flags': [],
            'sizeInCm': null,
            'sizeInInches': null,
            'weightInKg': null,
            'weightInLb': null,
        };
    }

    bagNumberFound($res)  {
        this.$data['bagNumber'] = $res['bagNumber'];
    }

    chargesMayApplyDisclaimerFound($res)  {
        this.$data['flags'].push('hasChargesMayApplyDisclaimer');
    }

    personalItemFound($res)  {
        this.$data['flags'].push('personalItem');
        this.$data['bagDescription'] = $res['description'];
    }

    baggageChargesDataNotAvailableTokenFound($res)  {
        this.$data['flags'].push('baggageChargesDataNotAvailable');
        this.$data['bagDescription'] = $res['description'];
    }

    notPermittedTokenFound($res)  {
        this.$data['flags'].push('notPermitted');
        this.$data['bagDescription'] = $res['description'];
    }

    excessPieceTokenFound($res)  {
        this.$data['flags'].push('excessPiece');
        this.$data['bagDescription'] = $res['description'];
    }

    extraHandBaggageTokenFound($res)  {
        this.$data['flags'].push('extraHandBaggage');
        this.$data['bagDescription'] = $res['description'];
    }

    unclassifiedBagDescriptionFound($description)  {
        this.$data['flags'].push('unclassifiedBagDescription');
        this.$data['bagDescription'] = $description;
    }

    carryOnPersonalItemsTokenFound($res)  {
        this.$data['flags'].push('carryOnBaggageAllowance');
        this.$data['bagDescription'] = $res['description'];
    }

    carryOnBaggageAllowanceTokenFound($res)  {
        this.$data['flags'].push('carryOnBaggageAllowance');
        this.$data['bagDescription'] = $res['description'];
    }

    feeTokenFound($res)  {
        if ($res['noFeeFlag']) {
            this.$data['flags'].push('noFeeFlag');
        } else {
            this.$data['feeAmount'] = $res['feeAmount'];
            this.$data['feeCurrency'] = $res['feeCurrency'];
        }
        this.$data['bagDescription'] = php.trim($res['textLeft']);
    }

    /** @param $res = NextToken::matchSizeConstraintsToken() */
    sizeConstraintsTokenFound($res)  {
        this.$data['sizeInInches'] = $res['sizeInInches'] || null;
        this.$data['sizeInCm'] = $res['sizeInCm'] || null;
    }

    weightConstraintsTokenFound($res)  {
        this.$data['weightInLb'] = $res['weightInLb'];
        this.$data['weightInKg'] = $res['weightInKg'];
    }

    getStructure()  {
        return this.$data;
    }
}
module.exports = BagLineStructureWriter;
