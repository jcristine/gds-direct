import {AREA_LIST} from "../constants";
import {getStore} from "../store";
import {getters} from "../state";

const update_cur_gds = (sessionInfo) => {
	let {canCreatePq, canCreatePqErrors, area, pcc, startNewSession, log, gdsName} = sessionInfo;

	const sessionIndex	= AREA_LIST.indexOf(area);

	const pc 	= {[sessionIndex] : pcc};
	let pccUpd	= startNewSession ? pc : {...getStore().app.Gds.getGds(gdsName).get('pcc'), ...pc};
	for (let areaSetting of (window.GdsDirectPlusState.getGdsAreaSettings()[gdsName] || [])) {
		// show default PCC on empty areas instead of nothing
		let idx = AREA_LIST.indexOf(areaSetting.area);
		if (!pccUpd[idx] || !sessionInfo.cmdCnt) {
			pccUpd[idx] = areaSetting.defaultPcc;
		}
	}

	let idxToInfo = startNewSession ? {} : {...getStore().app.Gds.getGds(gdsName).get('idxToInfo') || {}};
	idxToInfo[sessionIndex] = sessionInfo;

	getStore().app.Gds.update({pcc : pccUpd, canCreatePq, canCreatePqErrors, sessionIndex, idxToInfo}, gdsName);

	return {
		log,
		canCreatePq,
	};
};

export const CHANGE_GDS = gdsName => {
	getters('gds', gdsName);

	getStore().app.Gds.setCurrent(gdsName);

	const { fontSize, language, theme } = getStore().app.Gds.getCurrent().get();

	getStore().app.getContainer().changeFontClass(fontSize);
	getStore().app.changeStyle(theme);

	getStore().updateView({
		gdsObjName 	: getStore().app.Gds.getCurrentName(),
		gdsObjIndex : getStore().app.Gds.getCurrentIndex(),
		fontSize,
		language,
		theme,
	});
};

export const UPDATE_CUR_GDS = props => {
	getStore().setState({
		...update_cur_gds(props),
	});
};

export const UPDATE_ALL_AREA_STATE = (gds, fullState) => {
	let updateArea = (area) => UPDATE_CUR_GDS({
		canCreatePqErrors: [],
		...((fullState.areas || {})[area] || {}),
		startNewSession: false,
		area: area,
		gdsName: gds,
	});
	for (let area of AREA_LIST) {
		updateArea(area); // set data of each area
	}
	updateArea(fullState.area); // set current area
};

/**
 * update PCC-s displayed on each area button if not signed in yet
 * @param saveData = at('keySettings.es6').Context.prototype._collectSaveData()
 */
export const UPDATE_DEFAULT_AREA_PCCS = (gdsToSetting) => {
	for (let [gdsName, gdsSetting] of Object.entries(gdsToSetting)) {
		let gdsUnit = getStore().app.Gds.getGds(gdsName);
		if (!gdsUnit) continue; // just in case

		let idxToInfo = gdsUnit.get('idxToInfo') || {};
		for (let areaSetting of gdsSetting.areaSettings) {
			let defaultPcc = areaSetting.defaultPcc;
			let area = areaSetting.area;
			let areaIdx = AREA_LIST.indexOf(area);
			let areaInfo = idxToInfo[areaIdx] || {};
			if (areaInfo.pcc) continue; // some PCC already emulated

			let idxToPcc = getStore().app.Gds.getGds(gdsName).get('pcc');
			if (idxToPcc[areaIdx] == defaultPcc) continue;

			getStore().app.Gds.update({pcc: {...idxToPcc, [areaIdx]: defaultPcc}}, gdsName);
			getStore().setState({}); // to redraw UI
		}
	}
};