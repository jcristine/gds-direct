
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const AmadeusUtils = require('../../../../../GdsHelpers/AmadeusUtils.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * determine scrolling format run all remaining MD-s if
 * possible, return full output including all MD-s called before
 */
class MoveDownAllAction extends AbstractGdsAction {
	async execute(cmdLog, limit) {
		const mdCmdRows = await cmdLog.getScrolledCmdMrs();
		const originalCmdRow = php.array_shift(mdCmdRows);
		if (!originalCmdRow) {
			// if session just started for example
			return {userMessages: ['There is nothing to scroll']};
		}
		let format = AmadeusUtils.guessFormatFromCmd(originalCmdRow.cmd);
		if (!format) {
			if (AmadeusUtils.isRtFormatPage(originalCmdRow.output)) {
				format = {
					moveRestCmd: 'MDR',
					parsePager: page => AmadeusUtils.parseRtPager(page),
				};
			} else {
				return {errors: ['Unsupported scrolling format - ' + originalCmdRow.cmd]};
			}
		}
		const usedMdCmds = php.array_values(php.array_unique(php.array_column(mdCmdRows, 'cmd')));
		const wrongMds = php.array_diff(usedMdCmds, [format.moveRestCmd]);
		if (!php.empty(wrongMds)) {
			// probably could do >MT; and fetch from start in such case
			const error = 'Mixed MD commands are not supported - got ' +
				wrongMds.join(', ') + ', expected only ' + format.moveRestCmd;
			return {errors: [error]};
		}

		const pages = php.array_merge(
			[originalCmdRow['output']],
			php.array_column(mdCmdRows, 'output')
		);

		let i = 1;
		const cleanPages = [];
		let hasMore = true;
		let done = false;
		while (!done) {
			const page = php.array_shift(pages)
				|| (await this.runCmd(format.moveRestCmd)).output;
			const pager = format.parsePager(page);
			hasMore = pager.hasMore;
			cleanPages.push(pager.content);
			done = !hasMore || i++ >= limit;
		}

		const $fullCalledCommand = {
			cmd: originalCmdRow['cmd'],
			output: php.implode(php.PHP_EOL, cleanPages),
			hasMore: hasMore,
		};

		return {calledCommands: [$fullCalledCommand]};
	}
}

module.exports = MoveDownAllAction;
