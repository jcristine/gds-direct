const rules = {
	apollo : {
		pos 	: '¤:3SSRDOCSYYHK1/N'.length,
		cmd		: '¤:3SSRDOCSYYHK1/N ///// DMMMYY/ //          /          /',

		rules	: [
			' /////',
			// '¤:3SSRDOCSYYHK1/N',
			' DMMMYY',
			' // ',
			'          /',
			'          /',
		]
	},

	sabre 	: {
		pos		: '3DOCSA/DB/'.length,
		cmd		: '3DOCSA/DB/DDMMMYY/      /        /        -',
		rules	: [
			'3DOCSA/DB/'
		]
	},

	amadeus 	: {
		pos		: 'SRDOCSYYHK1'.length,
		cmd		: 'SRDOCSYYHK1-----  DDMMMYY   -     --        -       /P',
		rules	: [
			'SRDOCSYYHK1'
		]
	}
};

export default class F8Reader
{
	constructor({terminal, gds})
	{
		this.index		= 0;
		this.terminal 	= terminal;
		this.isActive 	= false;
		this.gds		= gds;
		this.currentCmd	= rules[gds];
	}

	getIsActive()
	{
		return this.isActive;
	}

	getNextTabPos()
	{
		const subStr = this.currentCmd.rules[ this.index ];
		return this.terminal.get_command().indexOf( subStr ); // + ( this.index === 0 ? subStr.length : 0 );
	}

	jumpToNextPos()
	{
		this.terminal.cmd().position( this.getNextTabPos() );

		if ( !this.currentCmd.rules[this.index] )
		{
			this.isActive 	= false;
			this.index 		= 0;
		}

		this.index++;
	}

	replaceChar()
	{
		const curPos 			= this.terminal.cmd().position();
		const charToReplace 	= this.terminal.get_command().substr(curPos, 1);

		if (charToReplace === '/')
			return false;

		this.terminal.cmd().delete(+1);
	}

	tie()
	{
		this.index 		= 0;
		this.isActive	= true;

		this.terminal.set_command( this.currentCmd.cmd );
		this.jumpToNextPos();
	}

	execCommand()
	{
		const cmd = this.terminal.before_cursor();
		this.terminal.cmd().set('');

		this.isActive	= false; // BEWARE of dead loop!
		this.terminal.exec(cmd);
	}
}