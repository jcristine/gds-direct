
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
        $self.canCreatePq = $row['can_create_pq'] || '';
        $self.pricingCmd = $row['pricing_cmd'] || '';
        $self.area = $row['area'] || '';
        $self.recordLocator = $row['record_locator'] || '';
        $self.pcc = $row['pcc'] || '';
        $self.hasPnr = $row['has_pnr'] || false;
        $self.isPnrStored = $row['is_pnr_stored'] || false;
        $self.cmdType = $row['cmdType'] || false;
        $self.gdsData = $row['gdsData'] || false;
        return $self;
    }

    toArray()  {

        return {
            'can_create_pq': this.canCreatePq,
            'pricing_cmd': this.pricingCmd,
            'area': this.area,
            'record_locator': this.recordLocator,
            'pcc': this.pcc,
            'has_pnr': this.hasPnr,
            'is_pnr_stored': this.isPnrStored,
            'cmdType': this.cmdType,
            'gdsData': this.gdsData,
        };
    }

    updateFrom($that)  {
		Object.assign(this, $that);
    }
}
module.exports = SessionStateDs;
