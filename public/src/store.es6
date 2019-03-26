import {getters, setProvider, setState} from "./state";
let store;

export const connect = (app) => {
	setProvider( State => app.getContainer().render(State) );
	store = new Store(app);
};

class Store
{
	constructor(app)
	{
		this.setApp(app);
	}

	getApp()
	{
		return this.app;
	}

	setApp(app)
	{
		this.app = app;
	}

	setState(state)
	{
		setState(state)
	}

	updateView(props)
	{
		store.app.calculateMatrix(props);
	}
}

export const getStore = () => store;