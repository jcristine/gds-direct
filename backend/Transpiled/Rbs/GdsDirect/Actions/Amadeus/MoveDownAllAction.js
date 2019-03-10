// namespace Rbs\GdsDirect\Actions\Amadeus;

const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const AmadeusUtils = require('../../../../../GdsHelpers/AmadeusUtils.js');

/**
 * determine scrolling format run all remaining MD-s if
 * possible, return full output including all MD-s called before
 */
const php = require('../../../../php.js');
const SessionStateProcessor = require('../../SessionStateProcessor/SessionStateProcessor.js');

class MoveDownAllAction extends AbstractGdsAction {
	async execute($cmdLog, $limit) {
		let $usedMdCmds, $mdCmdRows, $originalCmdRow, $format, $wrongMds, $pages, $i, $cleanPages, $hasMore, $page,
			$pager, $fullCalledCommand;

		$usedMdCmds = SessionStateProcessor.mrCmdTypes;
		$mdCmdRows = await $cmdLog.getLastCommandsOfTypes($usedMdCmds);
		if (!($originalCmdRow = php.array_shift($mdCmdRows))) {
			// if session just started for example
			return {'userMessages': ['There is nothing to scroll']};
		}
		if (!($format = AmadeusUtils.guessFormatFromCmd($originalCmdRow['cmd']))) {
			return {'errors': ['Unsupported scrolling format - ' + $originalCmdRow['cmd']]};
		}
		$usedMdCmds = php.array_values(php.array_unique(php.array_column($mdCmdRows, 'cmd')));
		if (!php.empty($wrongMds = php.array_diff($usedMdCmds, [$format['moveRestCmd']]))) {
			// probably could do >MT; and fetch from start in such case
			return {'errors': ['Mixed MD commands are not supported - got ' + php.implode(', ', $wrongMds) + ', expected only ' + $format['moveRestCmd']]};
		}

		$pages = php.array_merge(
			[$originalCmdRow['output']],
			php.array_column($mdCmdRows, 'output')
		);

		$i = 1;
		$cleanPages = [];
		$hasMore = true;
		let done = false;
		while (!done) {
			$page = php.array_shift($pages)
				|| (await this.runCmd($format['moveRestCmd'])).output;
			$pager = $format['parsePager']($page);
			$hasMore = $pager['hasMore'];
			done = !$hasMore || $i++ >= $limit;
			if (done) {
				$cleanPages.push($page); // to keep pager
			} else {
				$cleanPages.push($pager['content']);
			}
		}

		$fullCalledCommand = {
			'cmd': $originalCmdRow['cmd'],
			'output': php.implode(php.PHP_EOL, $cleanPages),
		};

		return {'calledCommands': [$fullCalledCommand]};
	}
}

module.exports = MoveDownAllAction;
