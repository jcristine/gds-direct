import {AREA_LIST, GDS_LIST} from "../constants";

export const update_cur_gds = (app, {canCreatePq, canCreatePqErrors, area, pcc, startNewSession, log}) => {

	const sessionIndex	= AREA_LIST.indexOf(area);

	// const newAction 	= {canCreatePq, canCreatePqErrors, sessionIndex};

	if (startNewSession)
	{
		app.Gds.update({pcc : {[sessionIndex] : pcc}, ...{canCreatePq, canCreatePqErrors, sessionIndex}});
	} else
	{
		app.Gds.updatePcc({[sessionIndex] : pcc});
		app.Gds.update({canCreatePq, canCreatePqErrors, sessionIndex});
	}

	return {
		gdsList : app.Gds.getList(),
		log,
		canCreatePq
	}
};

export const change_gds = (app, gdsName)  => {
	app.Gds.setCurrent(gdsName);

	return {
		gdsObjName 	: app.Gds.getCurrentName(),
		gdsObjIndex : GDS_LIST.indexOf(gdsName)
	}
};