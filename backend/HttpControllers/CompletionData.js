const Pccs = require("../Repositories/Pccs");

exports.getPccList = async () => {
	const pccs = await Pccs.getAll();
	return pccs.map(row => ({
		id: 0,
		label: row.gds + ' ' + row.pcc + ' - ' + row.consolidator,
		pcc: row.pcc,
		/** @deprecated - should drop it where it is used */
		name: row.pcc,
		gds: row.gds,
		consolidator: row.consolidator,
		isTourFare: row.content_type === 'Tour',
	}));
};