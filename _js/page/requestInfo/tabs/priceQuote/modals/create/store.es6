let render, state, reducer;

export const createStore = (reducerFn) => {
	reducer 	= reducerFn;

	return (context, root) => {
		context 	= context();

		document.getElementById(root).appendChild(
			context.getContext()
		);

		render = state => context.render(state);

		return {
			render : (initState) => {
				state = {...initState};
				render(state)
			}
		}
	}
};

export const dispatch = (action, props) => {
	state = setState(state, action(props));
	render(state);
	return state;
};

// export const createRender 	= root => render = state => root.render(state);
// export const connect = (initState, translate) => {
// 	language 	= translate;
// 	state 		= initState;
//
// 	return context => {
// 		return createRender(context)(state);
// 	}
// };

const setState = (state, props) => {
	let newState = reducer(state, props);
	state = {...state, ...newState};

	console.log('State changed : ', state);
	return state;
};

export const getState = () => state;