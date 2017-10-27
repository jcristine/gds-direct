import Requests from '../helpers/requests.es6';

let beforeStack		= [];
let promises 		= [];
const stack			= [];

export default class Session
{
	constructor( params )
	{
		this.settings = params;
	}

	run(cmd)
	{
		return Requests.runSyncCommand({
			terminalIndex	: parseInt(this.settings['terminalIndex']) + 1,
			command			: cmd,
			gds				: this.settings['gds'],
			language		: window.TerminalState.getLanguage().toLowerCase(),
			terminalData	: window.apiData['terminalData']
		});
	}

	perform()
	{
		return new Promise( resolve => {

			const run = () => {
				const cmd = beforeStack[0]();
				beforeStack.shift();

				return this
					.run(cmd)
					.then(resolve) //output result
					.then( () => {
						const nextCmd = stack.shift();

						if (nextCmd)
							return nextCmd();

						promises = [];
					})
			};

			if (!promises.length)
			{
				promises.push( run() );
			}
			else
			{
				stack.push(run);
			}
		});
	}

	pushCommand(before)
	{
		beforeStack.push( before );
		return this;
	}
}