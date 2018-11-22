import App from 'application';
import {dispatch} from 'es6!../store';
import {getLang} from 'es6!../language';
import {UPDATE} from 'es6!../actions/common';

export const ReservationDump = () => {
	return App.components.create('textArea.form-control input-sm t-courier m-t-sm m-b-sm', {
		// rows 		: 9,
		style 		: 'max-height: 425px',
		placeholder : getLang('insertDump'),
		onchange 	: e => {
			dispatch(UPDATE, {key : 'dump', value : e.target.value})
		}
	}).assignRender( (state, _this) => {
		_this.context.disabled 	= state.canDump === false;
		_this.context.classList.toggle('is-error', state.errors.dump === true && !state.props.dump);

		_this.context.value =  state.props.dump.trim();

		setTimeout( () => {
			_this.context.style.height 	= '94px';

			if (_this.context.scrollHeight)
				_this.context.style.height = ( _this.context.scrollHeight + 4 ) + 'px';
		}, 0);
	})
};

export const ClientRemark = () => {
	return App.components.create('textArea.form-control input-sm m-t-sm', {
		rows 		: 3,
		placeholder : getLang('clientRemark'),
		onchange 	: e => {
			dispatch(UPDATE, {key : 'clientRemark', value : e.target.value})
		}
	}).assignRender( (state, _this) => {
		_this.context.value 	= state.props.clientRemark;
		_this.context.disabled 	= !state.canCliRemark;
	})
};

export const InternalRemark = () => {
	return App.components.create('textArea.form-control input-sm m-t-sm', {
		rows 		: 3,
		placeholder : getLang('internalRemark'),
		onchange 	: e => {
			dispatch(UPDATE, {key : 'internalRemark', value : e.target.value})
		}
	}).assignRender( (state, _this) => {
		_this.context.value 	= state.props.internalRemark;
	})
};