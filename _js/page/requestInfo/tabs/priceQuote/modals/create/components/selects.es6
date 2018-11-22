import App 		from 'application';
import Helper 	from 'abstract/helper';

import {dispatch} from 'es6!../store';
import {getLang} from 'es6!../language';
import {UPDATE} from 'es6!../actions/common';
import {PCC_UPDATE} from "es6!../actions/common";
const Component = App.components.create;

export const Wrapper = (name, component) => {

	return Component('div.row m-b-sm')
		.observeEl([
			Component(`div.col-sm-2 text-right label-control m-t-xs text-capitalize[${name}:]`),
			Component('div.col-sm-10')
				.observeEl(
					component
				)
		]);
};

export const MileAge = () => {

	const component = Component({
		context : 'select.form-control m-b-sm',

		props	: {
			onchange 	: e => dispatch(UPDATE, {key : 'mileage', value : e.target.value})
		},

		_mount : (_this) => {
			_this
				.append([
					new Option('Please select MileAge', 0),
					...App.get('mileages').map( obj => new Option(obj.name, obj.id))
				])
		},

		_renderer : (state, _this) => {
			_this.context.value = state.props.mileage;
			_this.getContext().classList.toggle('is-error', (!!state.errors.mileage && state.props.mileage === 0));
		}
	});

	return Wrapper(getLang('mileage'), component).assignRender( (state, _this) => {
		_this.getContext().classList.toggle('hidden', state.canMileAge === false);
	});
};

export const PccSelect = () => {

	const component = Component({
		context : 'select.form-control',
		_mount 	: _this => {
			const isTour = {};

			$(_this.context).append('<option selected disabled hidden value="-1"> </option>');

			_this
				.append(
					App.get('apolloPcc').map( pcc => {
						isTour[pcc.id] = !!pcc.isTourFare;
						return new Option(pcc.label, pcc.id)
					})
				);

			Helper.wrapSelect2(_this.context, {
				templateResult: data => {
					const icon = isTour[data.id] ? '<i class="fa fa-bed text-primary t-f-size-15 m-l-xs"></i>' : '';
					return [data.text,  icon];
				}
			});

			$(_this.context).on('select2:select', e => dispatch(PCC_UPDATE, {key : 'pcc', value : e.target.value}));
		},

		_renderer : (state, _this) => {
			// GDS direct does not receive PCC list directly from apiData
			if (state.props.selectPcc && Array.isArray(state.props.selectPcc)) {
				_this
					.append(
						state.props.selectPcc.map(pcc => new Option(pcc.label, pcc.id))
					);
			}

			_this.getContext().disabled = state.canPcc === false;
			$(_this.context).val(state.props.pcc).trigger('change');

			const select2 = $(_this.context).data('select2');
			if (select2) {
				const isError = state.canPcc && state.errors && state.errors.pcc === true && state.props.pcc === -1;
				select2.$selection.toggleClass('is-error', isError);
			}
		}
	});

	return Wrapper(getLang('pcc'), component);
};

export const CurrencySelect = () => {

	const component = Component({
		context : 'select.form-control',

		props	: {
			onchange 	: e => dispatch(UPDATE, {key : 'currency', value : e.target.value})
		},

		_mount : (_this) => {
			_this
				.append(
					App.get('currency').map(obj => new Option(obj.name, obj.id) )
				)
		},

		_renderer : (state, _this) => {
			// GDS direct does not receive Currency list directly from apiData
			if (state.props.selectCurrency && Array.isArray(state.props.selectCurrency)) {
				_this
					.append(
						state.props.selectCurrency.map(obj => new Option(obj.name, obj.id) )
					);
			}

			_this.setState({value : state.props.currency});
			_this.getContext().disabled = state.canCurrency === false;
		}
	});

	return Wrapper(getLang('currency'), component);
};