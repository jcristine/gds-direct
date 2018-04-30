import {AREA_LIST} from "../constants";

export const update_cur_gds = (app, {canCreatePq, canCreatePqErrors, area, pcc, startNewSession, log, gdsName}) => {

	const sessionIndex	= AREA_LIST.indexOf(area);

	const pc 	= {[sessionIndex] : pcc};
	let pccUpd	= startNewSession ? pc : {...app.Gds.getGds(gdsName).get('pcc'), ...pc};

	app.Gds.update({pcc : pccUpd, canCreatePq, canCreatePqErrors, sessionIndex}, gdsName);

	/*if (startNewSession)
	{
		app.Gds.update({pcc : {[sessionIndex] : pcc}, ...{canCreatePq, canCreatePqErrors, sessionIndex}}, gdsName);
	} else
	{
		app.Gds.updatePcc({[sessionIndex] : pcc}, gdsName);
		app.Gds.update({canCreatePq, canCreatePqErrors, sessionIndex}, gdsName);
	}*/

	return {
		log,
		canCreatePq
	}
};

export const change_gds = (app, gdsName)  => {
	app.Gds.setCurrent(gdsName);

	return {
		gdsObjName 	: app.Gds.getCurrentName(),
		gdsObjIndex : app.Gds.getCurrentIndex()
	}
};