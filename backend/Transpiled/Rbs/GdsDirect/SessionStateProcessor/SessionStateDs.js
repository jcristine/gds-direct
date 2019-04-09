
// namespace Rbs\GdsDirect\SessionStateProcessor;

/**
 * this class represents the session state structure i believe
 * it would be handy to define it somewhere since we are
 * currently passing it as associative array everywhere
 *
 * this structure represents the state of GDS
 * session after application of certain commands
 */
const php = require('../../../php.js');
class SessionStateDs
{
	constructor() {
		this.canCreatePq = null;
		this.pricingCmd = null;
		this.area = null;
		this.recordLocator = null;
		this.pcc = null;
		this.hasPnr = null;
		this.isPnrStored = null;
		this.cmdType = null;
		this.gdsData = null; // for GDS-es without native area support
	}

    static makeFromArray($row)  {
        let $self;

        $self = new this();
        $self.canCreatePq = $row['canCreatePq'] || '';
        $self.pricingCmd = $row['pricingCmd'] || '';
        $self.area = $row['area'] || '';
        $self.recordLocator = $row['recordLocator'] || '';
        $self.pcc = $row['pcc'] || '';
        $self.hasPnr = $row['hasPnr'] || false;
        $self.isPnrStored = $row['isPnrStored'] || false;
        $self.cmdType = $row['cmdType'] || false;
        $self.gdsData = $row['gdsData'] || false;
        return $self;
    }

    toArray()  {

        return {
            'canCreatePq': this.canCreatePq,
            'pricingCmd': this.pricingCmd,
            'area': this.area,
            'recordLocator': this.recordLocator,
            'pcc': this.pcc,
            'hasPnr': this.hasPnr,
            'isPnrStored': this.isPnrStored,
            'cmdType': this.cmdType,
            'gdsData': this.gdsData,
        };
    }

    updateFrom($that)  {
		Object.assign(this, $that);
    }
}
module.exports = SessionStateDs;
