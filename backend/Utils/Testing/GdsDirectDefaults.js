
const {nonEmpty} = require('klesun-node-tools/src/Lang.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const Agent = require("../../DataFormats/Wrappers/Agent");
const Fp = require('../../Transpiled/Lib/Utils/Fp.js');
const AnyGdsStubSession = require('./AnyGdsStubSession.js');
const CmdLog = require('../../GdsHelpers/CmdLog.js');
const StatefulSession = require('../../GdsHelpers/StatefulSession.js');

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
			'recordLocator': '',
			'hasPnr': false,
			'isPnrStored': false,
		};
	}

	static makeDefaultApolloState() {
		return php.array_merge(this.makeDefaultStateBase(), {
			'gds': 'apollo', 'pcc': '2G55',
		});
	}

	static makeDefaultGalileoState() {
		return php.array_merge(this.makeDefaultStateBase(), {
			'gds': 'galileo', 'pcc': '711M',
		});
	}

	static makeDefaultSabreState() {
		return php.array_merge(this.makeDefaultStateBase(), {
			'gds': 'sabre', 'pcc': '6IIF',
		});
	}

	static makeDefaultAmadeusState() {
		return php.array_merge(this.makeDefaultStateBase(), {
			'gds': 'amadeus', 'pcc': 'SFO1S2195',
		});
	}

	static makeDefaultStateFor(gds) {
		return {
			apollo: () => this.makeDefaultApolloState(),
			sabre: () => this.makeDefaultSabreState(),
			amadeus: () => this.makeDefaultAmadeusState(),
			galileo: () => this.makeDefaultGalileoState(),
		}[gds]();
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
			// expert with EDIT_VOID_TICKETED_PNR role
			Agent.makeStub(php.array_merge(this.makeAgentBaseData(), {
				'row': php.array_merge($defaultRow, {
					'id': '100548',
					'login': 'Chad',
					'name': 'Stefan Stratan',
					'sabre_initials': 'SX',
					'team_id': '2180',
				}),
				'roleRows': [
					{company: 'ITN', role: "login"},
					{company: 'ITN', role: "NEW_GDS_DIRECT_ACCESS"},
					{company: 'ITN', role: "NEW_GDS_DIRECT_PNR_SEARCH"},
					{company: 'ITN', role: "NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR"},
					{company: 'ITN', role: "NEW_GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS"},
					{company: 'ITN', role: "NEW_GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY"},
					{company: 'ITN', role: "NEW_GDS_DIRECT_PASTE_ITINERARY"},
					{company: 'ITN', role: "can_add_pq_with_forced_fare"},
					{company: 'ITN', role: "can_add_pqs"},
					{company: 'ITN', role: "IS_PQ_AUDITOR"},
				],
			})),
			// something like the lead of ticketing
			Agent.makeStub(php.array_merge(this.makeAgentBaseData(), {
				'row': php.array_merge($defaultRow, {
					'id': '5820',
					'login': 'Rico',
					'name': 'Iuri Bitca',
					'fp_initials': 'IX',
					'sabre_initials': 'IE',
					'team_id': '2173',
				}),
				'roleRows': [
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_NO_LEAD_PNR"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_DEV_ACCESS"},
					{'company': 'ITN', 'role': "IS_SUPERVIZOR"},
					{'company': 'ITN', 'role': "IS_BOOKKEEPENG"},
					{'company': 'ITN', 'role': "IS_TICKETING_AGENT"},
					{'company': 'ITN', 'role': "IS_CS_LUXFLIGHTONAUT"},
					{'company': 'ITN', 'role': "IS_PAYMENT_LUXFLIGHTONAUT"},
					{'company': 'ITN', 'role': "IS_TICKETING_LUXFLIGHTONAUT"},
					{'company': 'ITN', 'role': "IS_ADMIN_LUXFLIGHTONAUT"},
					{'company': 'ITN', 'role': "IS_CS_AGENT"},
					{'company': 'ITN', 'role': "IS_MILEAGE_INFO_TRUSTED_LUXFLIGHTONAUT"},
					{'company': 'ITN', 'role': "IS_B2B_MERCHANT"},
					{'company': 'ITN', 'role': "IS_3RD_PARTY_CC_EDITOR"},
					{'company': 'ITN', 'role': "login"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_ACCESS"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_TICKETING"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_QUEUE_PROCESSING"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_PNR_SEARCH"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_EDIT_TICKETED_PNR"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_PASTE_ITINERARY"},
					{'company': 'ITN', 'role': "NEW_GDS_DIRECT_HHMCO"},
					{'company': 'ITN', 'role': "can_add_pqs"},
					{'company': 'ITN', 'role': "CMD_soldTicketsDailyReport"},
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

	static makeStatefulSessionCustom(params) {
		let {session, fullState, startDt, emcUser, leadIdToData, ...ctorArgs} = params;
		const gds = session.context.gds;
		fullState = fullState || {
			area: 'A',
			areas: {'A': this.makeDefaultStateFor(gds)},
		};
		const cmdLog = CmdLog.noDb({gds, fullState});
		const stubAirports = require('../../../tests/data/stubAirports.js');
		return StatefulSession({
			cmdLog, session, fullState,
			startDt: startDt || '2019-03-29 23:43:05',
			emcUser: emcUser || {
				id: 1234,
				displayName: 'grectUnitTest',
				roles: [],
			},
			Db: {
				writeRows: () => Promise.resolve(),
			},
			GdsSessions: {
				update: () => Promise.resolve(),
			},
			RbsClient: {
				reportCreatedPnr: () => Promise.resolve(),
			},
			leadIdToData: leadIdToData || {},
			...ctorArgs,
			Airports: {
				findByCode: code => nonEmpty
					('Code #' + code + ' not supplied by test')
					(stubAirports.filter(row => row.iata_code === code)[0]),
				findByCity: code => nonEmpty
					('Code #' + code + ' not supplied by test')
					(stubAirports.filter(row => row.city_code === code)[0]),
			},
		});
	}

	static makeStatefulSession(gds, $input, $sessionInfo) {
		const {initialState, initialCommands = [], performedCommands} = $sessionInfo;
		const gdsSession = (new AnyGdsStubSession(performedCommands)).setGds(gds);
		const session = {
			context: {
				gds: gds,
				travelRequestId: initialState.lead_id || 1,
			},
			gdsData: {
				someGdsSpecificField: 'fake12345',
			},
		};
		const fullState = {
			area: 'A',
			areas: {'A': initialState},
		};
		const makeAgent = (id) => {
			return ($input.stubAgents || []).filter(a => a.getId() == id)[0]
				|| GdsDirectDefaults.makeStubAgentById(id);
		};
		// GdsDirectDefaults.makeStatefulSession($input, $sessionInfo);
		const agentId = initialState.agent_id || 6206322;
		const agent = makeAgent(agentId);
		const leadOwnerId = initialState.lead_creator_id || 6206;
		const leadOwner = makeAgent(leadOwnerId);
		const stateful = this.makeStatefulSessionCustom({
			gdsSession, session, fullState,
			startDt: $input.baseDate || '2019-03-29 23:43:05',
			emcUser: {
				id: agentId,
				displayName: agent ? agent.getLogin() : null,
				roles: [...agent.getRoles(), 'can_save_pnr'],
			},
			leadIdToData: {
				[session.context.travelRequestId]: {
					leadId: session.context.travelRequestId,
					leadOwnerId: leadOwnerId,
					leadOwnerLogin: leadOwner ? leadOwner.getLogin() : null,
				},
			},
			...($sessionInfo.ctorArgs || {}),
		});
		for (const cmdRec of initialCommands) {
			stateful.getLog().logCommand(cmdRec.cmd, Promise.resolve(cmdRec));
		}
		return stateful;
	}
}

module.exports = GdsDirectDefaults;
