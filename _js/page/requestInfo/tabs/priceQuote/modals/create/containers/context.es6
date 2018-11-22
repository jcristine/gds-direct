import App from 'application';
import {ClientRemark, InternalRemark, ReservationDump} from "es6!../components/textareas";
import {Prices} 		from "es6!../components/prices";
import {CLOSE, CREATE, SHOW_ERRORS} from "es6!../actions/common";
import {dispatch} from "es6!../store";
import {MileAge, PccSelect, CurrencySelect} from "es6!../components/selects";
import {getLang} from "es6!../language";
import {DetailsSwitch} from "es6!../components/detailsSwitch";
import {HotelWrap} from "es6!../components/hotels";
import {url} from 'abstract/helper';
import {PANELS, VARS} from 'page/common/constants';
import {getState} from "../store";

const Component = App.components.create;

const onClose = () => {
	document.body.classList.remove('modal-open-pq');

	const state = dispatch(CLOSE);

	if (state.onClose)
	{
		state.onClose();
	}

	url.panel.remove(PANELS.priceQuote, PANELS.priceQuoteClone);
	url.var.remove(VARS.pqcId);
};

export const CreatePqContext = () => (
	Component('aside.aside-xxxl bg-white b-b b-l b-t')
		.observeEl(
			Component('section.vbox')
				.observeEl([
					Component('header.header b-b')
						.observeEl([
							Component(`p.t-f-size-14[${getLang('createPq')}]`)
								.assignRender( (state, _this) => {
									_this.context.innerHTML = getLang(state.clone ? 'clone' : 'create') + ' ' + getLang('pqLabel');
								}),

							Component('span.close m-t-sm[&times;]', {onclick : onClose})
						]),

					Component('section.scrollable wrapper w-f', {style : 'background : #f7f7f7; padding : 10px 15px'})
						.observeEl([
							DetailsSwitch(),
							ReservationDump(),
							PccSelect(),
							CurrencySelect(),
							MileAge(),
							Prices(),
							ClientRemark(),
							InternalRemark(),
							HotelWrap()
						]),

					Component('footer.footer b-t')
						.observeEl([
							Component(`button.btn btn-success font-bold[${getLang('create')}]`, {
								onclick : () => CREATE()
									.then( onClose )
									.catch( err => dispatch(SHOW_ERRORS, err))
							}),

							Component('button.btn btn-success m-l-sm font-bold[Confirm & Save]', {
								onclick : () => CREATE()
									.then( () => {
										onClose();
										const isStandalone = App.get('terminalData')['isStandAlone'];
										if (!isStandalone) {
											App.publish('leadInfo/openPqTab');
											App.publish('/pqTable/refresh');
										} else {
											window.open(`/leadInfo?rId=${getState().rId}`);
										}
									})
									.catch( err => dispatch(SHOW_ERRORS, err))
							}).assignRender((state, _this) => {
								_this.context.classList.toggle('hidden', state.terminal === false);
							})
						])
				])
		)
		.assignRender((props, _this) => {
			_this.context.classList.toggle('hidden', props.isHidden);
		})
);