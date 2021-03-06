const FakeAreaUtil = require('../GdsHelpers/Amadeus/FakeAreaUtil.js');
const MaskUtil = require('../Transpiled/Lib/Utils/MaskingUtil.js');
const Agent = require('../DataFormats/Wrappers/Agent.js');
const MultiLevelMap = require('../Utils/MultiLevelMap.js');
const Db = require('../Utils/Db.js');
const TerminalSettings = require('../Transpiled/App/Models/Terminal/TerminalSettings.js');
const GdsSessions = require("../Repositories/GdsSessions");

const getCommandBufferRows = (reqBody, emcResult) =>
	Db.with(db => db.fetchAll({
		table: 'cmd_rs_log',
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
			const bufferMap = MultiLevelMap();
			rows = rows.reverse();
			for (const row of rows) {
				bufferMap.push(['gds', row.gds, 'terminals', row.terminalNumber, 'buffering'], {
					area: row.area,
					language: row.dialect,
					command: row.command,
					output: row.output,
				});
			}

			for (const gds in settings.gds) {
				const rqPart = {gds: gds, travelRequestId: +reqBody.travelRequestId};
				const state = await GdsSessions.getByContext(rqPart, emcResult.user)
					.then(GdsSessions.getFullState)
					.catch(exc => ({}));

				settings.gds[gds].fullState = state;
				settings.gds[gds].areaLetters = GdsSessions.getAreaLetters(gds);
			}
			let buffer = bufferMap.root;
			if (!Agent(emcResult.user).canSeeCcNumbers()) {
				buffer = MaskUtil.maskCcNumbers(buffer);
			}
			const matchesGds = r => r.gds === settings.common.currentGds;
			const allowedPccRecs = emcResult.user.allowedPccRecs || [];
			if (allowedPccRecs.length > 0 &&
				!allowedPccRecs.some(matchesGds)
			) {
				settings.common.currentGds = allowedPccRecs[0].gds;
			}

			return {
				enabled: true,
				disableReason: '',
				settings: settings,
				buffer: buffer,
				auth: emcResult.user,
			};
		})
	);
};
