const Agents = require("../../Repositories/Agents");

/**
 * @param {IEmcUser} emcUser
 */
const Agent = (emcUser) => {
	//let roles = testRoles;
	const roles = emcUser.roles || [];
	// 6206 - aklesuns
	const hasRole = (role) => roles.includes(role);
	return {
		getId: () => emcUser.id,
		getLogin: () => emcUser.displayName,
		getFsCallsUsed: () => Agents.getFsCallsUsed(emcUser.id).then(rec => rec.cnt),
		getFsCallsUsedRec: () => Agents.getFsCallsUsed(emcUser.id),
		getFsLimit: () => (emcUser.settings || {}).gds_direct_fs_limit || null,
		getUsageLimit: () => (emcUser.settings || {}).gds_direct_usage_limit || null,

		canIssueTickets                : () => hasRole('NEW_GDS_DIRECT_TICKETING'),
		canProcessQueues               : () => hasRole('NEW_GDS_DIRECT_QUEUE_PROCESSING'),
		canSearchPnr                   : () => hasRole('NEW_GDS_DIRECT_PNR_SEARCH'),
		canEditTicketedPnr             : () => hasRole('NEW_GDS_DIRECT_EDIT_TICKETED_PNR'),
		canEditVoidTicketedPnr         : () => hasRole('NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR'),
		canSeeCcNumbers                : () => hasRole('NEW_GDS_DIRECT_CC_ACCESS'),
		canSeeContactInfo              : () => hasRole('NEW_GDS_DIRECT_CONTACT_INFO_ACCESS'),
		canSwitchToAnyPcc              : () => hasRole('NEW_GDS_DIRECT_EMULATE_ANY_PCC'),
		canPerformAnyPccAvailability   : () => hasRole('NEW_GDS_DIRECT_ANY_PCC_AVAILABILITY'),
		canEmulateToRestrictedSabrePccs: () => hasRole('NEW_GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS'),
		canSavePnrWithoutLead          : () => hasRole('NEW_GDS_DIRECT_NO_LEAD_PNR'),
		canOpenPrivatePnr              : () => hasRole('NEW_GDS_DIRECT_PRIVATE_PNR_ACCESS'),
		canUseMultiPccTariffDisplay    : () => hasRole('NEW_GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY'),
		canPasteItinerary              : () => true, // hasRole('NEW_GDS_DIRECT_PASTE_ITINERARY'),
		canUseMco                      : () => hasRole('NEW_GDS_DIRECT_HHMCO'),

		getRoles: () => roles,
		hasGroup: (groupName) => {
			const groups = (emcUser.groups || []);
			return groups.some(g => g.name === groupName);
		},
	};
};

Agent.makeStub = (params) => {
	const row = params.row;
	return Agent({
		id: row.id,
		displayName: row.login,
		settings: {
			gds_direct_fs_limit: row.gds_direct_fs_limit,
			gds_direct_usage_limit: row.gds_direct_usage_limit,
		},
		roles: (params.roleRows || []).map(r => r.role),
	});
};

module.exports = Agent;