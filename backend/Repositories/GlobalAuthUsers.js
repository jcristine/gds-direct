const Rej = require('klesun-node-tools/src/Rej.js');

const crypto = require('crypto');

/**
 * @module - at some point likely would make sense to keep them
 * in DB and have an admin page to add them without modifying code
 *
 * unlike normal EMC users, these ones are assigned to people outside our company
 * and can be logged-in without a certificate - they exist only in context of GDS Direct
 *
 * this is intended for our partner airlines. In past this functionality was provided
 * by RBS team, but having airlines work in GDS Direct in a way similar to normal
 * agents will allow us to have single implementation of session state restrictions
 * as well as such nice things as logging, highlighting, etc...
 *
 * @see https://gitlab.dyninno.net/focal-point-emulator/airline-fp-emulator
 */

const users = [
	{
		id: 2000000000,
		login: 'default_user',
		passwordHash: 'b4065edd4b8e14ae4a27bfc54701cc9441c9775fdb89eed739c59968cb546e8b',
		roles: [],
		// TODO: implement!
		allowedPccRecs: [
			{gds: 'amadeus', pcc: 'LAXGO3106'},
		],
	},
	{
		id: 2000000001,
		login: 'main_user',
		passwordHash: '13aa2415df9cca3f8e035d63cda10273897f4d9b97bad4dc606fe5e969d7aff2',
		roles: [
			'NEW_GDS_DIRECT_TICKETING',
			'NEW_GDS_DIRECT_QUEUE_PROCESSING',
			'NEW_GDS_DIRECT_PNR_SEARCH',
			'NEW_GDS_DIRECT_EDIT_TICKETED_PNR',
			'NEW_GDS_DIRECT_EDIT_VOID_TICKETED_PNR',
			'NEW_GDS_DIRECT_CC_ACCESS',
			'NEW_GDS_DIRECT_CONTACT_INFO_ACCESS',
			'NEW_GDS_DIRECT_EMULATE_ANY_PCC',
			'NEW_GDS_DIRECT_ANY_PCC_AVAILABILITY',
			'NEW_GDS_DIRECT_CAN_EMULATE_TO_RESTRICTED_SABRE_PCCS',
			'NEW_GDS_DIRECT_NO_LEAD_PNR',
			'NEW_GDS_DIRECT_PRIVATE_PNR_ACCESS',
			'NEW_GDS_DIRECT_MULTI_PCC_TARIFF_DISPLAY',
			'NEW_GDS_DIRECT_HHMCO',
			'can_add_pq_with_forced_fare',
		],
		allowedPccRecs: [],
	},
];

exports.getByLogin = (login, password) => {
	const passwordHash = crypto.createHash('sha256')
		.update(password).digest('hex');
	for (const user of users) {
		if (user.passwordHash === passwordHash) {
			return Promise.resolve(user);
		}
	}
	return Rej.NotAuthorized('Invalid global auth login or password: ' + login);
};
