import {COPY_NET_VAL, PRICE_CHANGE} from "es6!../actions/common";
import {dispatch} 			from "es6!../store";
import {getLang} 			from "es6!../language";

const App 			= require('application');
const Component 	= App.components.create;

export const Prices = () => {
	return Component({
		context : 'div',
		onMount : ({props, canNetVal}, _this) => {
			_this.observeEl(
				props.prices.map((price, index) => PricePerType({...price, canNetVal}, index))
			);
		}
	})
};

const renderer = ({props, errors}, _this, index, name) => {
	const pax	 	= props.prices[index];
	const isError	= errors.prices && errors.prices[index] && errors.prices[index][name];

	const val 		= parseFloat(pax[name]) >= 0 ? pax[name] : '';

	_this.context.classList.toggle('is-error', !val && !!isError);
	_this.context.value = val;
};

const PriceComponent = ({props, index, name}) => {
	return Component('input.form-control', {
		...props,
		onchange: e => dispatch(PRICE_CHANGE, {index, name, value: e.target.value})
	})
};

const PricePerType = (pax, index) => (
	Component('div.row m-b-sm')
		.append(
			App.Dom(`span.col-sm-2 text-right label-control m-t-xs text-capitalize[${pax.name}:]`)
		)
		.observeEl([
			Component('div.col-sm-5')
				.observeEl(
					PriceComponent({
						index,
						name	: 'selVal',
						props 	: {
							value : pax.selVal
						}
					})

					.assignRender( ({props, errors, canMarkup}, _this) => {
						renderer({props, errors}, _this, index, 'selVal');
						_this.context.placeholder = canMarkup ? getLang('minMarkup') : getLang('sellingPrice');
					})
				),

			Component('div.col-sm-5')
				.attach(
					Component('i.fa fa-long-arrow-left pos-abt m-t-sm m-l-n-lg t-pointer', {
						onclick : () => dispatch(
							COPY_NET_VAL, {index})
						})
				)
				.observeEl(
					PriceComponent({
						name	: 'netVal',
						index	: index,
						props 	: {
							value		: pax.netVal,
							disabled 	: !pax.canNetVal
						}
					})
						.assignRender( ({props, errors, canMileAge, canNetVal, revenueOpt}, _this) => {
							renderer({props, errors}, _this, index, 'netVal');

							let netMandatory 	= props.detailsNotRequired;

							if (!netMandatory && canMileAge)
							{
								netMandatory = parseInt(revenueOpt.id) !== parseInt(props['mileage']);
							}

							_this.context.disabled 		= !canNetVal;
							_this.context.placeholder 	= netMandatory ? getLang('netPrice') : getLang('netPriceOpt');
						})
				)
		])
);