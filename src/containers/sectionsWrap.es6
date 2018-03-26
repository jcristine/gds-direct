import Component 		from "../modules/component";
import {RightSide} 		from "./sides/right";
import ActionsMenu 		from "../components/actionsMenu";
import TerminalMatrix 	from "../components/terminalMatrix";
import {PqQuotes}		from "../components/PqQuotes";

export class TableSections extends Component
{
	constructor()
	{
		super('table.term-body minimized');

		this
			.observe(
				new Component('tr')
					.observe( new LeftTd() )
					.observe( new PqQuotes())
					.observe( new RightSide() )
			)
	}
}

class LeftTd extends Component
{
	constructor()
	{
		super('td.left');

		this
			.observe( new TerminalMatrix() )
			.observe( new ActionsMenu() );
	}
}

