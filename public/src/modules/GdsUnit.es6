import {AREA_LIST} from "../constants";
import TerminalCell from "./TerminalCell";
import {getStorageMatrix} from "../helpers/helpers";

/**
 * represents a grid of particular GDS terminal
 * cells, like Apollo terminal or Sabre terminal
 */
export class GdsUnit
{
	constructor(name, area, buffer, settings)
	{
		const { matrix, hasWide } = settings.matrix || {};

		this.props		= {
			name 			: name,
			list			: settings.areaLetters,
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

				terminals[index] = new TerminalCell({
					name 	: index,
					gds		: this.get('name'),
					buffer	: this.get('buffer') ? this.get('buffer')['terminals'][index + 1] : '',
					getSessionInfo: () => this.props.idxToInfo[this.props.sessionIndex] || {},
				});

			});

		terminals['wide'] = terminals['wide'] || new TerminalCell({
			name 	: 'wide',
			gds		: this.get('name'),
			buffer	: '',
			getSessionInfo: () => this.props.idxToInfo[this.props.sessionIndex] || {},
		});

		this.set('terminals', terminals);
		this.set('dimensions', dimensions);
	}

	/** @return {TerminalCell[]} */
	getTerminals()
	{
		return Object.values(this.get('terminals'));
	}

	/** @return {TerminalCell} */
	getActiveTerminal()
	{
		return this.get('terminals')[ this.get('curTerminalId') ];
	}
}
