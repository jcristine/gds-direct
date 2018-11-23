export default (state, {type, ...props} = {}) => {

	let newState = {};

	switch(type)
	{
		case 'PRICE_CHANGE':
			const prices = state.props.prices.map((price, index) => {

				if (index === props.index)
				{
					return {...price, [props.name] : props.value}
				}

				return price;
			});
			newState = { props : { ...state.props , prices} };
		break;

		case 'COPY_NET_VAL':
			const selPrice = state.props.prices.map( (price, i) => (props.index === i ? {...price, ['selVal'] : price['netVal']} : price));
			newState = { props : { ...state.props , prices : selPrice} };
		break;

		case 'PCC_UPDATE' :
			const isHotel = state.tourFareArray.filter( pcc => parseInt(props.pcc) === parseInt(pcc.id)).length > 0;

			newState.props 	= {...state.props, ...props};
			newState 		= {...newState, isTourFare : isHotel};
		break;

		case 'TOUR' :
			newState.tour = {...state.tour, ...props};
		break;

		case 'UPDATE' :
			newState.props = {...state.props, ...props};
		break;

		case 'VALIDATE' :
			newState.errors = {...props};
		break;

		case 'RESET' :
			newState.errors = {...state.errors, ...props};
		break;

		case 'CLOSE' :
			newState = {...state, isHidden : true};
		break;

		default :
			newState = {...state, ...props};
	}

	return newState;
};