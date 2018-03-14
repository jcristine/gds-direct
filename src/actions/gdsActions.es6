import {AREA_LIST, GDS_LIST} from "../constants";

export const update_gds = (app, props) => {

	const {canCreatePq, canCreatePqErrors, area, pcc, startNewSession} = props;

	const sessionIndex	= AREA_LIST.indexOf(area);

	const newAction = {canCreatePq, canCreatePqErrors, sessionIndex};

	if (startNewSession)
	{
		app.Gds.update({pcc : {[sessionIndex] : pcc}, ...newAction});
	} else
	{
		app.Gds.updatePcc({[sessionIndex] : pcc});
		app.Gds.update(newAction);
	}

	return {
		gdsList : app.Gds.getList(),
		log 	: props.log,
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