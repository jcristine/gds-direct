import {getStore} from "../store";
import {OFFSET_QUOTES} from "../constants";
import {getters} from "../state";

const isHidden = false;

const showPq = (newState = {}, offset = 100) => {
	getStore().app.setOffset(offset);
	getStore().updateView(newState);
};

export const SHOW_PQ_QUOTES = () => {
	const offset = getStore().app.getOffset() === 0 ? 400 : OFFSET_QUOTES;
	showPq({pqToShow : 'loading'}, offset);

	return getters('showExistingPq').then(response => (
		showPq({pqToShow:response}, offset)
	));
};

export const HIDE_PQ_QUOTES = () => {
	const offset = getStore().app.getOffset() === 400 ? 0 : 100;
	return showPq({pqToShow:false}, offset);
};

export const SET_REQUEST_ID = rId => {
	getStore().app.set('requestId', rId);
	return Promise.resolve();
};

const openPq = app => {
	app.pqParser.show( app.getGds(), app.params.requestId, app.params.isStandAlone )
		.then(() => showPq({menuHidden : true}, 0));
};

export const PQ_MODAL_SHOW 	= () => openPq(getStore().app);
export const CLOSE_PQ_WINDOW = () => showPq({menuHidden : false});