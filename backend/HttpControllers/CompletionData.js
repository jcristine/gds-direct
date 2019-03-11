const Pccs = require("../Repositories/Pccs");

exports.getData = async (req) => {
    let pccs = await Pccs.getAll();
    return pccs.map(row => ({
        "id": 0,
        "label": row.gds + ' ' + row.pcc + ' - ' + row.consolidator,
        "name": row.pcc,
        "gds": row.gds,
        "consolidatorName": row.consolidator,
        "isTourFare": row.content_type === 'Tour',
    }));
};