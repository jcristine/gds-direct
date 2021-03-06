import {DEFAULT_CELLS} from "../constants";

const common = {
	'`': '>',
	'[': '¤',
	']': '$',
	'=': '*',
	';': ':',
	'\'': '‡',
	'\\': '§'
};

const sabreLayout 	= Object.assign({}, common);
const apolloLayout 	= Object.assign({}, common, {
	',' : '+'
});

const _to_ascii = {
	'188': '44',
	'109': '45',
	'190': '46',
	'191': '47',
	'192': '96',
	'220': '92',
	'222': '39',
	'221': '93',
	'219': '91',
	'173': '45',
	'187': '61', //IE Key codes
	'186': '59', //IE Key codes
	'189': '45',  //IE Key codes

	'59': '59',  //FF Key codes  ;
	'61': '61'  //FF Key codes  =
};

export const replaceChar	= (value, char) => value.replace(new RegExp(char, 'g'), '');
export const getFirstNumber = line 	=> line.match(/^\d+|\d+\b|\d+(?=\w)/)[0];
export const escapeSpecials	= value => value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');


export const getReplacement = ( evt, isApollo, targetGds ) => {
	const char = String.fromCharCode(evt.keyCode || evt.which);
	return isApollo && targetGds === 'apollo' ? apolloLayout[char] : sabreLayout[char];
};

const chunkIntoPages = ( linesArr , rowsPerScreen ) => {
	return linesArr.map(
		(line, lineIndex) => lineIndex % rowsPerScreen ? [] : linesArr.slice( lineIndex , lineIndex + rowsPerScreen )
	)
	.filter( data  => !!data.length	);
};

export const makePages = (txt, rowsPerScreen = 20, maxCharLimit) => {
	const chunkByCharLimit = splitIntoLinesArr( txt, maxCharLimit );

	return chunkIntoPages(chunkByCharLimit, rowsPerScreen).map(
		(sectionLines) => sectionLines.join('\n')
	);
};

export const splitIntoLinesArr = ( txt, maxCharLimit ) => {
	const lines 		= splitLines(txt);
	const regex 		= new RegExp(`(.{1,${maxCharLimit}})`, 'gi');

	let chunkByCharLimit= [];

	lines.forEach( (line) => {
		let lineArr = line.match(regex);
		chunkByCharLimit = chunkByCharLimit.concat(lineArr);
	});

	return chunkByCharLimit;
};

export const splitLines = (txt) => txt.split(/\r?\n/);

const makeDate = (d) => d < 10 ? '0' + d : d;

export const getDate = () => {
	const d         = new Date();
	const date      = d.getDate();
	const months    = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

	const d2        = new Date();
	const dPlus320  = new Date(d2.setDate(date + 320));
	const p320Date  = dPlus320.getDate();

	const d3        = new Date();
	const dMinus45  = new Date(d3.setDate(date + 320));
	const m45Date   = dMinus45.getDate();

	return {
		now         : makeDate(date) + months[d.getMonth()],
		plus320     : makeDate(p320Date) + months[dPlus320.getMonth()],
		minus45     : makeDate(m45Date) + months[dMinus45.getMonth()]
	};
};

const _getStorage = (name) => {
	const saved	= localStorage.getItem(name);
	return saved ? JSON.parse(saved) : false;
};

export const getStorageMatrix = () => {

	const matrix = _getStorage('matrix');

	if (matrix && !matrix.list)
			return {rows : 1, cells : 1, list : [...DEFAULT_CELLS]};

	if (!matrix)
	{
		return {rows : 1, cells : 1, list : [...DEFAULT_CELLS]};
	}

	return matrix;
};