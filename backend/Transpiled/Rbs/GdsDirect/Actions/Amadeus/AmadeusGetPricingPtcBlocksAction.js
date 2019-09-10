

const AmadeusPricingCommonFormatAdapter = require('../../../../Rbs/FormatAdapters/AmadeusPricingCommonFormatAdapter.js');
const CommandParser = require('../../../../Gds/Parsers/Amadeus/CommandParser.js');
const FxParser = require('gds-utils/src/text_format_processing/amadeus/FxParser.js');
const PagingHelper = require('../../../../../GdsHelpers/AmadeusUtils.js');
const AbstractGdsAction = require('../../../GdsAction/AbstractGdsAction.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const AmadeusUtil = require("../../../../../GdsHelpers/AmadeusUtils");

/**
 * fetch all PTC sub-pricings mentioned in the pricing dump if any
 */
class AmadeusGetPricingPtcBlocksAction extends AbstractGdsAction
{
	constructor({session = null} = {}) {
		super();
		this.session = session;
		this.$cmdCmdToFullDump = {};
	}

	setCmdToFullDump($cmdCmdToFullDump)  {
		this.$cmdCmdToFullDump = $cmdCmdToFullDump;
		return this;
	}

	async amadeusFx($cmd) {
		return (await AmadeusUtil.fetchAllFx($cmd, this)).output;
	}

	/** get full output of a state-safe command like FQQ or FQN */
	async runOrReuseFx($cmd)  {
		return (this.$cmdCmdToFullDump || {})[$cmd]
			|| (this.$cmdCmdToFullDump[$cmd] = await this.amadeusFx($cmd));
	}

	/** @param $ptcPricing = AmadeusPricingCommonFormatAdapter::transformPtcBlock() */
	static makeBagPtcBlock($ptcPricing, $storeNum, $ptcNum)  {

		return {
			quoteNumber: $storeNum,
			subPricingNumber: $ptcNum,
			passengerNameNumbers: $ptcPricing['passengerNameNumbers'],
			ptcInfo: $ptcPricing['ptcInfo'],
			raw: $ptcPricing['baggageInfo']['raw'],
			parsed: $ptcPricing['baggageInfo']['parsed'],
		};
	}

	/**
     * @param $mods = [CommandParser::parsePricingModifier(), ...]
     * @param $nameRecords = AmadeusReservationParser::parse()['parsed']['passengers']
     */
	static getSinglePtcInfo($mods, $nameRecords)  {
		let $discount, $ageGroup;

		$mods = php.array_combine(php.array_column($mods, 'type'), php.array_column($mods, 'parsed'));
		$discount = (($mods['generic'] || {})['ptcs'] || {})[0] || 'ADT';
		$ageGroup = AmadeusPricingCommonFormatAdapter.parsePtc($discount)['ageGroup'];
		return {
			ptc: $discount,
			ptcRequested: (($mods['generic'] || {})['ptcs'] || {})[0],
			quantity: !php.empty($nameRecords) ? php.count($nameRecords) : 1,
			pricingPaxNums: !php.empty($nameRecords) ? php.range(1, php.count($nameRecords)) : [1],
			ageGroup: $ageGroup,
			ageGroupRequested: $ageGroup,
			nameNumbers: php.array_column($nameRecords, 'nameNumber'),
		};
	}

	/**
     * @param $ptcInfo = AmadeusPricingCommonFormatAdapter::groupPtcList()
     */
	async fetchPtcBlock($ptcInfo)  {
		let $cmd, $output, $parsed, $error, $ptcBlock;

		$cmd = 'FQQ'+php.intval($ptcInfo['pricingPaxNums'][0]);
		$output = await this.runOrReuseFx($cmd);
		$parsed = FxParser.parse($output);
		if ($error = $parsed['error']) {
			return {error: $error};
		} else if ($parsed['type'] !== 'ptcPricing') {
			return {error: 'Failed to fetch particular PTC pricing because GDS returned '+$parsed['type']};
		} else {
			$ptcBlock = AmadeusPricingCommonFormatAdapter.transformPtcBlock($parsed, $ptcInfo);
			return $ptcBlock;
		}
	}

	/** @param string $pricingDump - full clean pricing dump */
	async execute(cmd, pricingDump, nameRecords = [])  {
		const pager = PagingHelper.parseFxPager(pricingDump);
		if (pager.hasMore) {
			return {error: 'Internal error - pricing has more pages'};
		}
		const parsed = FxParser.parse(pricingDump);
		const cmdParsed = CommandParser.parse(cmd);
		if (cmdParsed.type !== 'priceItinerary' || !cmdParsed.data) {
			return {error: 'Failed to parse pricing command - ' + cmd};
		}
		const cmdStores = cmdParsed.data.pricingStores;
		const pricingList = [];
		const bagPtcBlocks = [];
		const error = parsed.error;
		if (error) {
			return {error: error};
		} else if (parsed.type === 'ptcPricing') {
			// GDS returned single PTC pricing instantly
			if (php.count(cmdStores) <= 1) {
				const mods = cmdStores[0] || [];
				const ptcInfo = this.constructor.getSinglePtcInfo(mods, nameRecords);
				const ptcBlock = AmadeusPricingCommonFormatAdapter.transformPtcBlock(parsed, ptcInfo);
				ptcBlock.fetchedDumpNumber = null;
				bagPtcBlocks.push(this.constructor.makeBagPtcBlock(ptcBlock, 1, 1));
				delete ptcBlock.baggageInfo;
				pricingList.push({quoteNumber: 1, pricingModifiers: mods, pricingBlockList: [ptcBlock]});

			} else {
				return {error: 'GDS returned output for single PTC even though there were multiple pricing stores in command'};
			}
		} else if (parsed.type === 'ptcList') {
			// pricing summary with partial data - no FC, carrier, taxes...
			// need to call a separate command for each PTC
			const ptcGroups = AmadeusPricingCommonFormatAdapter.groupPtcList(
				parsed.data.passengers, cmdStores, nameRecords
			);
			for (const [i, ptcInfo] of Object.entries(ptcGroups)) {
				const storeNum = ptcInfo.storeNumber || 1;
				const ptcBlock = await this.fetchPtcBlock(ptcInfo);
				const error = ptcBlock['error'];
				if (error) {
					return {error: 'Failed to fetch ' + ptcInfo.ptc + ' PTC block - ' + error};
				} else {
					bagPtcBlocks.push(this.constructor.makeBagPtcBlock(ptcBlock, storeNum, +i + 1));
					delete ptcBlock.baggageInfo;
					pricingList[storeNum - 1] = pricingList[storeNum - 1] || {};
					pricingList[storeNum - 1].quoteNumber = storeNum;
					pricingList[storeNum - 1].pricingPcc = null; // current PCC, Amadeus does not show it in pricing
					pricingList[storeNum - 1].pricingModifiers = cmdStores[storeNum - 1] || [];
					pricingList[storeNum - 1].pricingBlockList = pricingList[storeNum - 1].pricingBlockList || [];
					pricingList[storeNum - 1].pricingBlockList.push(ptcBlock);
				}}
		} else {
			return {error: 'Unexpected pricing type - ' + parsed.type};
		}

		return {
			pricingList: pricingList,
			bagPtcPricingBlocks: bagPtcBlocks,
		};
	}
}
module.exports = AmadeusGetPricingPtcBlocksAction;
