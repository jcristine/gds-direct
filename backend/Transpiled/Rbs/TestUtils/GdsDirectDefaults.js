
// namespace Rbs\TestUtils;

let php = require('../../php');

/**
 * provides default session data/agent data/etc...
 * used in different tests of different GDS
 */
class GdsDirectDefaults
{
    static makeDefaultStateBase()  {
        return {
            'gds': null,
            'pcc': null,
            'area': 'A',
            'record_locator': null,
            'has_pnr': false,
            'is_pnr_stored': false,
            'can_create_pq': false,

            'id': 1,
            'activity_dt': '2018-01-01 00:00:00',
            'user_activity_dt': '2018-01-01 00:00:00',
            'is_active': true,
            'internal_token': 'fake123',
            'agent_id': 6206322,
            'lead_creator_id': 6206,
            'lead_id': 1,
        };
    }

    static makeDefaultApolloState()  {
        return php.array_merge(this.makeDefaultStateBase(), {
            'gds': 'apollo', 'pcc': '2G55'
        });
    }

    static makeDefaultGalileoState()  {
        return php.array_merge(this.makeDefaultStateBase(), {
            'gds': 'galileo', 'pcc': '711M'
        });
    }

    static makeDefaultSabreState()  {
        return php.array_merge(this.makeDefaultStateBase(), {
            'gds': 'sabre', 'pcc': '6IIF'
        });
    }

    static makeDefaultAmadeusState()  {
        return php.array_merge(this.makeDefaultStateBase(), {
            'gds': 'amadeus', 'pcc': 'SFO1S2195'
        });
    }
}
module.exports = GdsDirectDefaults;
