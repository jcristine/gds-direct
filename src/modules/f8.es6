const rules = {
	apollo : {
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
		cmd		: '3DOCSA/DB/DDMMMYY/      /        /        -',
		rules	: [
			'3DOCSA/DB/'
		]
	},

	amadeus 	: {
		cmd		: 'SRDOCSYYHK1-----  DDMMMYY   -     --        -       /P',
		rules	: [
			'SRDOCSYYHK1'
		]
	},

	galileo 	: {
		cmd		: 'SI.P /SSRDOCSYYHK1/////      / //       /',
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
		this.currentCmd	= rules[gds];
	}

	getIsActive()
	{
		return this.isActive;
	}

	_getNextTabPos()
	{
		const subStr = this.currentCmd.rules[ this.index ];
		return this.terminal.get_command().indexOf( subStr );
	}

	jumpToNextPos()
	{
		if ( !this.currentCmd.rules[this.index] )
		{
			this.isActive 	= false;
			this.index 		= 0;

			return false;
		}

		this.terminal.cmd().position( this._getNextTabPos() );
		this.index++;
	}

	replaceEmptyChar(evt)
	{
		if ( this.getIsActive() )
		{
			if (evt.key.length === 1 && !evt.ctrlKey) // issue 01
			{
				const curPos 			= this.terminal.cmd().position();
				const charToReplace 	= this.terminal.get_command().substr(curPos, 1);

				if (charToReplace === '/')
					return false;

				this.terminal.cmd().delete(+1);
			}
		}
	}

	getFullCommand()
	{
		this.index 		= 0;
		this.isActive	= true;
		return this.currentCmd.cmd;
	}
}