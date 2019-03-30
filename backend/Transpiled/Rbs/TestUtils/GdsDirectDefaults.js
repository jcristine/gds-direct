// namespace Rbs\TestUtils;

let php = require('../../php');
const Agent = require("../../../DataFormats/Wrappers/Agent");
const Fp = require('../../Lib/Utils/Fp.js');

/**
 * provides default session data/agent data/etc...
 * used in different tests of different GDS
 */
class GdsDirectDefaults {
	static makeDefaultStateBase() {
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

	static makeDefaultApolloState() {
		return php.array_merge(this.makeDefaultStateBase(), {
			'gds': 'apollo', 'pcc': '2G55'
		});
	}

	static makeDefaultGalileoState() {
		return php.array_merge(this.makeDefaultStateBase(), {
			'gds': 'galileo', 'pcc': '711M'
		});
	}

	static makeDefaultSabreState() {
		return php.array_merge(this.makeDefaultStateBase(), {
			'gds': 'sabre', 'pcc': '6IIF'
		});
	}

	static makeDefaultAmadeusState() {
		return php.array_merge(this.makeDefaultStateBase(), {
			'gds': 'amadeus', 'pcc': 'SFO1S2195'
		});
	}

	static makeAgentBaseData() {

		return {
			'row': {
				'id': '123',
				'login': 'default_stub_agent',
				'name': 'Default Stub Agent',
				'fp_initials': 'DS',
				'sabre_initials': 'DS',
				'sabre_lniata': '123',
				'sabre_id': '123',
				'email': 'default_stub_agent@itncorp.com',
				'team_id': '123',
				'is_active': true,
				'deactivated_dt': null,
				'updated_dt': '2018-01-05',
				'email_list': '{\"ITN\":\"default_stub_agent@itncorp.com\"}',
				'gds_direct_fs_limit': '123',
				'gds_direct_usage_limit': '2000',
			},
			'gdsDirectCallsUsed': '1000',
			'fsCallsUsed': '50',
			'roleRows': [
				{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_ACCESS'},
				{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_PNR_SEARCH'},
			],
		};
	}

	static makeDefaultDeveloperRoleRows() {

		return [
			{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_ACCESS'},
			{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_CONTACT_INFO_ACCESS'},
			{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EDIT_TICKETED_PNR'},
			{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EMULATE_ANY_PCC'},
			{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_PNR_SEARCH'},
			{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_QUEUE_PROCESSING'},
			{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_STORE_ANY_PRICING'},
			{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_TICKETING'},
		];
	}

	static makeStubAgentById($id) {
		let $defaultRow, $agents, $getId, $idToAgents;

		$defaultRow = this.makeAgentBaseData()['row'];
		$agents = [
			Agent.makeStub(this.makeAgentBaseData()),
			// simple agent based on real data
			Agent.makeStub(php.array_merge(this.makeAgentBaseData(), {
				'row': php.array_merge($defaultRow, {
					'id': '1588',
					'login': 'Prince',
					'name': 'Harindra Abeywickrama',
					'fp_initials': 'HC',
					'team_id': '2043',
				}),
			})),
			// ticketing agent based on real data
			Agent.makeStub(php.array_merge(this.makeAgentBaseData(), {
				'row': php.array_merge($defaultRow, {
					'id': '8050',
					'login': 'Kunkka',
					'name': 'Alexej Bejenari',
					'fp_initials': '42',
					'sabre_initials': 'LE',
					'team_id': '2001',
				}),
				'roleRows': [
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_ACCESS'},
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_TICKETING'},
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EDIT_TICKETED_PNR'},
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_PNR_SEARCH'},
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_QUEUE_PROCESSING'},
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_STORE_ANY_PRICING'},
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_NO_LEAD_PNR'},
				],
			})),
			// a simple guy, I dunno why, but he always had just
			// these roles on dev and tests are expecting that
			Agent.makeStub(php.array_merge(this.makeAgentBaseData(), {
				'row': php.array_merge($defaultRow, {
					// id changed to not match Agent::isRbsDeveloper()
					'id': '6206322',
					'login': 'aklesuns',
					'name': 'Arthur Klesun',
					'team_id': '1',
				}),
				'roleRows': [
					{'company': 'ITN', 'role': 'IS_AGENT'},
					{'company': 'ITN', 'role': 'IS_BACKOFFICE_DEVELOPER'},
					{'company': 'ITN', 'role': 'IS_LUXFLIGHTONAUT'},
				],
			})),
			// a developer
			Agent.makeStub(php.array_merge(this.makeAgentBaseData(), {
				'row': php.array_merge($defaultRow, {
					'id': '2838',
					'login': 'stanislaw',
					'name': 'Stanislaw',
					'team_id': '1',
				}),
				'roleRows': php.array_merge(this.makeDefaultDeveloperRoleRows(), [
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_EMULATE_ANY_PCC'},
					{'company': 'ITN', 'role': 'NEW_GDS_DIRECT_NO_LEAD_PNR'},
				]),
			})),
		];
		$getId = ($agent) => $agent.getId();
		$idToAgents = Fp.groupBy($getId, $agents);
		return ($idToAgents[$id] || {})[0];
	}
}

module.exports = GdsDirectDefaults;
