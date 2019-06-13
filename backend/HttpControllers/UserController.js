let MultiLevelMap = require('../Utils/MultiLevelMap.js');
let Db = require('../Utils/Db.js');
let TerminalSettings = require('../Transpiled/App/Models/Terminal/TerminalSettings.js');
const GdsSessions = require("../Repositories/GdsSessions");

let getCommandBufferRows = (reqBody, emcResult) =>
    Db.with(db => db.fetchAll({
        table: 'cmd_rq_log',
        where: [
            ['agentId', '=', emcResult.user.id],
            ['requestId', '=', reqBody.travelRequestId || 0],
        ],
        orderBy: 'id DESC',
        limit: 100, // standalone commands are taken for _whole time_
    }));

exports.getView = (reqBody, emcResult) => {
    return getCommandBufferRows(reqBody, emcResult).then(rows =>
        new TerminalSettings(emcResult).getSettings().then(async settings => {
            let bufferMap = MultiLevelMap();
            rows = rows.reverse();
            let isAdmin = emcResult.user.roles.includes('NEW_GDS_DIRECT_DEV_ACCESS');
            for (let row of rows) {
                bufferMap.push(['gds', row.gds, 'terminals', row.terminalNumber, 'buffering'], {
                    area: row.area,
                    language: row.dialect,
                    command: row.command,
                    output: row.output,
                });
            }

            for (let gds in settings.gds) {
                let rqPart = {gds: gds, travelRequestId: +reqBody.travelRequestId};
                let state = await GdsSessions.getByContext(rqPart, emcResult.user)
                    .then(GdsSessions.getFullState)
                    .catch(exc => ({}));

                settings.gds[gds].fullState = state;
            }

            return {
                enabled: true,
                disableReason: '',
                settings: settings,
                buffer: bufferMap.root,
                isAdmin: isAdmin,
                auth: emcResult.user,
            };
        })
    );
};
