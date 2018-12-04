let MultiLevelMap = require('./Utils/MultiLevelMap.es6');
let Db = require('./Utils/Db.es6');
let TerminalSettings = require('./Transpiled/App/Models/Terminal/TerminalSettings.es6');

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
            let currentGds = 'apollo';
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
            let usedSet = new Set();
            let lastCommands = rows
                .filter(row => row.gds === currentGds)
                .map(row => row.command)
                .filter(cmd => {
                    // remove dupes
                    let used = usedSet.has(cmd);
                    usedSet.add(cmd);
                    return !used;
                })
                .slice(-20);
            return {
                enabled: true,
                disableReason: '',
                settings: settings,
                buffer: bufferMap.root,
                lastCommands: lastCommands,
                auth: emcResult.user,
            };
        })
    );
};
