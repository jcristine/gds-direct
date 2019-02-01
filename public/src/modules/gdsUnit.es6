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
			defaultPcc		: settings.pcc || null,
			pcc				: {},
			canCreatePq		: false, //1
			canCreatePqErrors: [],
			history			: [],
			terminals		: {},
			curTerminalId	: undefined,
			dimensions		: {},
			hasWide			: hasWide === 'true',
			language		: settings.language || 'apollo',
			fontSize		: settings.fontSize || 1,
			keyBindings		: settings.keyBindings || {},
			theme			: settings.theme || 4,
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
					buffer	: this.get('buffer') ? this.get('buffer')['terminals'][index + 1] : ''
				});

			});

		terminals['wide'] = terminals['wide'] || new Terminal({
			name 	: 'wide',
			gds		: this.get('name'),
			buffer	: ''
		});

		this.set('terminals', terminals);
		this.set('dimensions', dimensions);
	}

	getActiveTerminal()
	{
		return this.get('terminals')[ this.get('curTerminalId') ];
	}
}