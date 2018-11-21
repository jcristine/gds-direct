import {Debug} from "./debug";

export const loggerOutput = (result, command) => {

	let commands = [];

	const date = new Date();

	const localTime = date.toLocaleTimeString('en-GB').replace(/:\d+ /, ' ');

	commands.push({
		text : localTime + ' ' + command,
		type : 'white'
	});

	if (result['clearScreen'])
		commands.push({
			text : 'DEBUG: CLEAR SCREEN',
			type : 'info'
		});

	if ( result['canCreatePq'] )
		commands.push({
			text : 'CAN CREATE PQ',
			type : 'warning'
		});

	if ( result['tabCommands'] && result['tabCommands'].length )
		commands.push({
			text : 'FOUND TAB COMMANDS',
			type : 'success'
		});

	if ( result['pcc'] )
		commands.push({
			text : 'CHANGE PCC',
			type : 'success'
		});

	return commands;
};

export const debugOutput = result => {

	if (result['clearScreen'])
		Debug( 'CLEAR SCREEN', 'info' );

	if ( result['canCreatePq'] )
		Debug( 'CAN CREATE PQ' , 'warning');

	if ( result['tabCommands'] && result['tabCommands'].length )
		Debug( 'FOUND TAB COMMANDS', 'success' );

	if ( result['pcc'] )
		Debug( 'CHANGE PCC', 'success' );
};