let MultiLevelMap = require('./Utils/MultiLevelMap.es6');
let Db = require('./Utils/Db.es6');

let dbPool = require('./App/Classes/Sql.es6');

let getCommandBufferRows = (reqBody, emcResult) => {
	return dbPool.getConnection()
		.then(dbConn => {
			return Db(dbConn).fetchAll({
				table: 'terminalBuffering',
				where: [
					['agentId', '=', emcResult.user.id],
					['requestId', '=', reqBody.travelRequestId || 0],
				],
				orderBy: 'id DESC',
				limit: 100, // standalone commands are taken for _whole time_
			}).finally(() => dbPool.releaseConnection(dbConn));
		});
};

exports.getView = (reqBody, emcResult) => {
    return getCommandBufferRows(reqBody, emcResult).then(rows => {
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
            settings: {
                "common": {"currentGds": currentGds},
                "gds": {
                    "apollo": {
                        "terminalsMatrix": [2, 2],
                        "language": "",
                        "area": "A",
                        "pcc": "2G52",
                        "terminalNumber": 1,
                        "fontSize": 1,
                        "canCreatePq": 0,
                        "keyBindings": null,
                        "theme": 0,
                        "matrix": {"hasWide": "false", "matrix": {"rows": 0, "cells": 0, "list": [0]}},
                        "defaultPcc": "",
                        "areaSettings": [
                            {
                                "id": 33,
                                "gds": "apollo",
                                "area": "A",
                                "agentId": 6206,
                                "defaultPcc": null
                            },
                            {
                                "id": 34,
                                "gds": "apollo",
                                "area": "B",
                                "agentId": 6206,
                                "defaultPcc": null
                            },
                            {
                                "id": 35,
                                "gds": "apollo",
                                "area": "C",
                                "agentId": 6206,
                                "defaultPcc": "2CV4"
                            },
                            {
                                "id": 36,
                                "gds": "apollo",
                                "area": "D",
                                "agentId": 6206,
                                "defaultPcc": null
                            },
                            {
                                "id": 37,
                                "gds": "apollo",
                                "area": "E",
                                "agentId": 6206,
                                "defaultPcc": null
                            }
                        ]
                    },
                },
            },
            buffer: bufferMap.root,
            lastCommands: lastCommands,
            auth: emcResult.user,
        };
    });
};