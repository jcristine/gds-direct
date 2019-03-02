
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
		this.$canCreatePq = null;
		this.$area = null;
		this.$recordLocator = null;
		this.$pcc = null;
		this.$hasPnr = null;
		this.$isPnrStored = null;
	}

    static makeFromArray($row)  {
        let $self;

        $self = new this();
        $self.$canCreatePq = $row['can_create_pq'] || '';
        $self.$area = $row['area'] || '';
        $self.$recordLocator = $row['record_locator'] || '';
        $self.$pcc = $row['pcc'] || '';
        $self.$hasPnr = $row['has_pnr'] || false;
        $self.$isPnrStored = $row['is_pnr_stored'] || '';
        return $self;
    }

    toArray()  {

        return {
            'can_create_pq': this.$canCreatePq,
            'area': this.$area,
            'record_locator': this.$recordLocator,
            'pcc': this.$pcc,
            'has_pnr': this.$hasPnr,
            'is_pnr_stored': this.$isPnrStored,
        };
    }

    updateFrom($that)  {

        this.$canCreatePq = $that.$canCreatePq;
        this.$area = $that.$area;
        this.$recordLocator = $that.$recordLocator;
        this.$pcc = $that.$pcc;
        this.$hasPnr = $that.$hasPnr;
        this.$isPnrStored = $that.$isPnrStored;
    }
}
module.exports = SessionStateDs;
