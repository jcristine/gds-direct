let MultiLevelMap = require('./Utils/MultiLevelMap.js');
let Db = require('./Utils/Db.js');
let TerminalSettings = require('./Transpiled/App/Models/Terminal/TerminalSettings.js');
let {admins} = require('./Constants.js');

let getCommandBufferRows = (reqBody, emcResult) =>
    Db.with(db => db.fetchAll({
        table: 'terminalBuffering',
        where: [
            ['agentId', '=', emcResult.user.id],
            ['requestId', '=', reqBody.travelRequestId || 0],
        ],
        orderBy: 'id DESC',
        limit: 100, // standalone commands are taken for _whole time_
    }));

exports.getView = (reqBody, emcResult) => {
    return getCommandBufferRows(reqBody, emcResult).then(rows =>
        new TerminalSettings(emcResult).getSettings().then(settings => {
            let bufferMap = MultiLevelMap();
            rows = rows.reverse();
            for (let row of rows) {
                bufferMap.push(['gds', row.gds, 'terminals', row.terminalNumber, 'buffering'], {
                    area: row.area,
                    language: row.dialect,
                    command: row.command,
                    output: row.output,
                });
            }
            return {
                enabled: true,
                disableReason: '',
                settings: settings,
                buffer: bufferMap.root,
                isAdmin: admins.includes(+emcResult.user.id),
                auth: emcResult.user,
            };
        })
    );
};
