// namespace Rbs\Process\Amadeus;
const StringUtil = require('../Transpiled/Lib/Utils/StringUtil.js');

/**
 * provides functions to fetch all output of Amadeus commands
 * different commands have different paging mark, so you have to know what exactly to use
 */
const php = require('../Transpiled/php.js');

let parseRtPager = ($page) => {
	let $matches, $_, $content, $hasMoreMark;

	if (php.preg_match(/^(?:\/\$)?(.+?)(\n\)\s*|)$/s, $page, $matches = [])) {
		[$_, $content, $hasMoreMark] = $matches;
		return {
			'content': $content,
			'hasPageMark': true,
			'hasMore': $hasMoreMark ? true : false,
		};
	} else {
		// errors usually have no pagination
		return {
			'content': $page,
			'hasPageMark': false,
			'hasMore': false,
		};
	}
};

let parseFxPager = ($page) => {
	let $matches, $_, $content, $current, $last;

	if (php.preg_match(/^(.*)\n\s*PAGE\s+(\d+)\s*\/\s*(\d+)\s*$/s, $page, $matches = [])) {
		[$_, $content, $current, $last] = $matches;
		return {
			'content': $content,
			'hasPageMark': true,
			'hasMore': php.intval($current) < php.intval($last),
			'pageNum': php.intval($current),
			'pageCnt': php.intval($last),
		};
	} else {
		// errors have no pagination
		return {
			'content': $page,
			'hasPageMark': false,
			'hasMore': false,
		};
	}
};

let parseHePager = ($page) => {
	let $matches, $content, $hasPageMark, $hasMore;

	if (php.preg_match(/^\/\$(.+?\s+?)(\n\s*|)MD\n\s*$/s, $page, $matches = [])) {
		$content = $matches[1];
		$hasPageMark = true;
		$hasMore = true;
	} else if (php.preg_match(/^\/\$(.+?)\n\s+\*\*\* END OF DISPLAY \*\*\*\s*$/s, $page, $matches = [])) {
		$content = $matches[1];
		$hasPageMark = true;
		$hasMore = false;
	} else {
		// errors usually have no pagination
		$content = $page;
		$hasPageMark = false;
		$hasMore = false;
	}
	return {
		'content': $content,
		'hasPageMark': $hasPageMark,
		'hasMore': $hasMore,
	};
};

/**
 * @param $parsePager = function($dump){return [
 *     'content' => 'CLEAN PAGE DUMP',
 *     'hasPageMark' => true,
 *     'hasMore' => false,
 * ];}
 */
let getCleanPages = async function($runCmd, $cmd, $mrCmd, $parsePager) {
	let $dumpWithPager, $pager, $cleanPage;
	let cleanPages = [];
	do {
		$dumpWithPager = (await $runCmd($cmd)).output;
		$pager = $parsePager($dumpWithPager);
		$cleanPage = $pager['content'];
		if ($pager['hasMore']) {
			$cmd = $mrCmd;
		} else {
			$cmd = null;
		}
		cleanPages.push($cleanPage);
	} while ($cmd !== null);

	return cleanPages;
};

let fetchAllWith = async ($runCmd, $cmd, $mrCmd, $parsePager) => {
	let $cleanPages = await getCleanPages($runCmd, $cmd, $mrCmd, $parsePager);
	return php.implode(php.PHP_EOL, $cleanPages);
};

class AmadeusUtils {
	static parseRtPager(page) {
		return parseRtPager(page);
	}

	static parseFxPager(page) {
		return parseFxPager(page);
	}

	static parseHePager(page) {
		return parseHePager(page);
	}

	/**
	 * for >DO...; command
	 * probably also works in >RT; and other commands that use ")" and "/$" to separate pages
	 */
	static async fetchAllRt(cmd, session) {
		let output = await fetchAllWith(cmd => session.runCmd(cmd), cmd,
			'MDR', (...args) => parseRtPager(...args));
		return {cmd, output};
	}

	/**
	 * for >FX...; and >FQN...; commands
	 * each page ends with a "PAGE 19/19"-like line
	 */
	static async fetchAllFx(cmd, session) {
		let output = await fetchAllWith(cmd => session.runCmd(cmd), cmd,
			'MD', (...args) => parseFxPager(...args));
		return {cmd, output};
	}

	/**
	 * for >HE...; commands
	 * each page starts with "/$" ends with a " MD" or "*** END OF DISPLAY ***"
	 */
	static async fetchAllHe(cmd, session) {
		let output = await fetchAllWith(cmd => session.runCmd(cmd), cmd,
			'MD', (...args) => parseHePager(...args));
		return {cmd, output};
	}

	/** @return array|null */
	static guessFormatFromCmd($cmd) {
		let $formats, $format, $prefix;

		// some frequent commands off the top of my head
		$formats = [
			{
				'moveRestCmd': 'MDR',
				'parsePager': (...args) => parseRtPager(...args),
				'prefixes': ['RT', 'DO', 'TQT', 'DAN', 'DAC', 'QV\/', 'SM', 'RH', 'FRN'],
			},
			{
				'moveRestCmd': 'MD',
				'parsePager': (...args) => parseFxPager(...args),
				'prefixes': ['FX', 'FQ'],
			},
			{
				'moveRestCmd': 'MD',
				'parsePager': (...args) => parseHePager(...args),
				'prefixes': ['HE', 'GP', 'MS'],
			},
		];
		for ($format of Object.values($formats)) {
			for ($prefix of Object.values($format['prefixes'])) {
				if (StringUtil.startsWith(php.ltrim($cmd), $prefix)) {
					return $format;
				}
			}
		}
		return null;
	}

	/** guessing scrolling type from command */
	static tryToFetchAll($runCmd, $cmd) {
		let $format;

		if ($format = this.guessFormatFromCmd($cmd)) {
			return fetchAllWith($runCmd, $cmd, $format['moveRestCmd'], $format['parsePager']);
		} else {
			// unknown command paging format - assuming single page
			return $runCmd($cmd);
		}
	}
}

module.exports = AmadeusUtils;
