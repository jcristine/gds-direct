import {getStore} from "../store";
import {OFFSET_QUOTES} from "../constants";
import {getters} from "../state";

const showPq = (newState, offset = 100) => {
	getStore().app.setOffset(offset);
	getStore().updateView(newState);
};

export const SHOW_PQ_QUOTES = () => getters('showExistingPq').then(response => showPq({pqToShow :response}, OFFSET_QUOTES) );
export const HIDE_PQ_QUOTES = () => showPq({pqToShow:false});

export const PQ_MODAL_SHOW 	= () => {
	getStore().app.pqParser
		.show( getStore().app.getGds(), getStore().app.params.requestId )
		.then(() => {
			showPq({hideMenu : true}, 0)
		})
};

export const CLOSE_PQ_WINDOW = () => showPq({hideMenu : false});