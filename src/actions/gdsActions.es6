import {AREA_LIST} from "../constants";
import {getStore} from "../store";
import {getters} from "../state";

const update_cur_gds = ({canCreatePq, canCreatePqErrors, area, pcc, startNewSession, log, gdsName}) => {

	const sessionIndex	= AREA_LIST.indexOf(area);

	const pc 	= {[sessionIndex] : pcc};
	let pccUpd	= startNewSession ? pc : {...getStore().app.Gds.getGds(gdsName).get('pcc'), ...pc};

	getStore().app.Gds.update({pcc : pccUpd, canCreatePq, canCreatePqErrors, sessionIndex}, gdsName);

	return {
		log,
		canCreatePq
	}
};

export const CHANGE_GDS = gdsName => {
	getters('gds', gdsName);

	getStore().app.Gds.setCurrent(gdsName);

	getStore().updateView({
		gdsObjName 	: getStore().app.Gds.getCurrentName(),
		gdsObjIndex : getStore().app.Gds.getCurrentIndex()
	});
};

export const UPDATE_CUR_GDS = props => {

	getStore().setState({
		...update_cur_gds(props)
	});
};