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
		pccUpd[idx] = pccUpd[idx] || areaSetting.defaultPcc;
	}

	let idxToInfo = startNewSession ? {} : {...getStore().app.Gds.getGds(gdsName).get('idxToInfo') || {}};
	idxToInfo[sessionIndex] = sessionInfo;

	getStore().app.Gds.update({pcc : pccUpd, canCreatePq, canCreatePqErrors, sessionIndex, idxToInfo}, gdsName);

	return {
		log,
		canCreatePq
	}
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
		theme
	});
};

export const UPDATE_CUR_GDS = props => {

	getStore().setState({
		...update_cur_gds(props)
	});
};