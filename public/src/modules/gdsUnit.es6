import {AREA_LIST} from "../constants";
import Terminal from "./terminal";
import {getStorageMatrix} from "../helpers/helpers";

export class GDS_UNIT
{
	constructor(name, area, buffer, settings)
	{
		const { matrix, hasWide } = settings.matrix || {};

		this.props		= {
			name 			: name,
			list			: name === 'sabre' ? AREA_LIST : AREA_LIST.slice(0, -1),
			buffer			: buffer[name],

			matrix			: matrix || getStorageMatrix(),
			sessionIndex 	: AREA_LIST.indexOf( area ),
			// area index to PCC mapping
			pcc				: {},
			canCreatePq		: false, //1
			canCreatePqErrors: [],
			history			: [],
			terminals		: {},
			curTerminalId	: undefined,
			dimensions		: null,
			hasWide			: hasWide === 'true',
			language		: settings.language || 'apollo',
			fontSize		: settings.fontSize || 1,
			keyBindings		: settings.keyBindings || {},
			theme			: settings.theme || 4,
			// area index to session state info mapping
			idxToInfo		: {},
		};

		return this;
	}

	get(name)
	{
		if (!name)
		{
			return this.props;
		}

		return this.props[name];
	}

	set(name, value)
	{
		this.props[name] = value;
	}

	update(newState)
	{
		this.props = {...this.props, ...newState};
	}

	updateMatrix(dimensions)
	{
		const {list} 	= this.get('matrix');

		let terminals = {...this.get('terminals')};

		list
			.filter( index => !terminals[index] )
			.forEach( index => {

				terminals[index] = new Terminal({
					name 	: index,
					gds		: this.get('name'),
					buffer	: this.get('buffer') ? this.get('buffer')['terminals'][index + 1] : '',
					getSessionInfo: () => this.props.idxToInfo[this.props.sessionIndex] || {},
				});

			});

		terminals['wide'] = terminals['wide'] || new Terminal({
			name 	: 'wide',
			gds		: this.get('name'),
			buffer	: '',
			getSessionInfo: () => this.props.idxToInfo[this.props.sessionIndex] || {},
		});

		this.set('terminals', terminals);
		this.set('dimensions', dimensions);
	}

	/** @return {Terminal[]} */
	getTerminals()
	{
		return Object.values(this.get('terminals'));
	}

	/** @return {Terminal} */
	getActiveTerminal()
	{
		return this.get('terminals')[ this.get('curTerminalId') ];
	}
}