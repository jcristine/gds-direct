const Agents = require("../../Repositories/Agents");

let testRoles = [
	'NEW_GDS_DIRECT_ACCESS',
	//'NEW_GDS_DIRECT_TICKETING',
	//'NEW_GDS_DIRECT_QUEUE_PROCESSING',
	'NEW_GDS_DIRECT_PNR_SEARCH',
	//'NEW_GDS_DIRECT_EDIT_TICKETED_PNR',
	//'NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR',
	//'NEW_GDS_DIRECT_CC_ACCESS',
	//'NEW_GDS_DIRECT_CONTACT_INFO_ACCESS',
	//'NEW_GDS_DIRECT_EMULATE_ANY_PCC',
	//'NEW_GDS_DIRECT_ANY_PCC_AVAILABILITY',
	//'NEW_GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS',
	//'NEW_GDS_DIRECT_NO_LEAD_PNR',
	//'NEW_GDS_DIRECT_PRIVATE_PNR_ACCESS',
	'NEW_GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY',
	'NEW_GDS_DIRECT_PASTE_ITINERARY',
	'NEW_GDS_DIRECT_HHMCO',
];

/**
 * @param {IEmcUser} emcUser
 */
let Agent = (emcUser) => {
	//let roles = testRoles;
	let roles = emcUser.roles || [];
	let hasRole = (role) => roles.includes(role);
	return {
		getId: () => emcUser.id,
		getLogin: () => emcUser.displayName,
		getFsCallsUsed: () => Agents.getFsCallsUsed(emcUser.id).then(rec => rec.cnt),
		getFsCallsUsedRec: () => Agents.getFsCallsUsed(emcUser.id),
		getFsLimit: () => (emcUser.settings || {}).gds_direct_fs_limit || null,

		canUseGdsDirect: () => hasRole('NEW_GDS_DIRECT_ACCESS'),
		canIssueTickets: () => hasRole('NEW_GDS_DIRECT_TICKETING'),
		canProcessQueues: () => hasRole('NEW_GDS_DIRECT_QUEUE_PROCESSING'),
		canSearchPnr: () => hasRole('NEW_GDS_DIRECT_PNR_SEARCH'),
		canEditTicketedPnr: () => hasRole('NEW_GDS_DIRECT_EDIT_TICKETED_PNR'),
		canEditVoidTicketedPnr: () => hasRole('NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR'),
		canSeeCcNumbers: () => hasRole('NEW_GDS_DIRECT_CC_ACCESS'),
		canSeeContactInfo: () => hasRole('NEW_GDS_DIRECT_CONTACT_INFO_ACCESS'),
		canSwitchToAnyPcc: () => hasRole('NEW_GDS_DIRECT_EMULATE_ANY_PCC'),
		canPerformAnyPccAvailability: () => hasRole('NEW_GDS_DIRECT_ANY_PCC_AVAILABILITY'),
		canEmulateToRestrictedSabrePccs: () => hasRole('NEW_GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS'),
		canSavePnrWithoutLead: () => hasRole('NEW_GDS_DIRECT_NO_LEAD_PNR'),
		canOpenPrivatePnr: () => hasRole('NEW_GDS_DIRECT_PRIVATE_PNR_ACCESS'),
		canUseMultiPccTariffDisplay: () => hasRole('NEW_GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY'),
		canPasteItinerary: () => true, // hasRole('NEW_GDS_DIRECT_PASTE_ITINERARY'),
		canUseMco: () => hasRole('NEW_GDS_DIRECT_HHMCO'),
	};
};

module.exports = Agent;