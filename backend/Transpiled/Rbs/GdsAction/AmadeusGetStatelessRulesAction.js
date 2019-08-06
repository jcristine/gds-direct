const AmadeusClient = require('../../../GdsClients/AmadeusClient');
const ImportPnrCommonFormatAdapter = require('../../Rbs/Process/Common/ImportPnr/ImportPnrCommonFormatAdapter.js');
const AbstractGdsAction = require('./AbstractGdsAction');
const _ = require('lodash');
const moment = require('moment');
const FareRuleSectionParser = require('../../Gds/Parsers/Common/FareRuleSectionParser');

/**
 * get static rules by origin/destination/fareBasis/date/etc...
 * using >FRN...; command (or SOAP function)
 */
class AmadeusGetStatelessRulesAction extends AbstractGdsAction {

	constructor() {
		super();
		this.cmdToParsedRules = [];
	}

	async getRulesUsingSoap(params) {
		try {
			const result = await AmadeusClient.getFareRules(this.session.getGdsData(), params);

			if(result.error) {
				return result;
			}

			return {
				header: result.header,
				sections: result.sections
					.map(s => FareRuleSectionParser.parse(s.raw, s.sectionNumber, s.sectionName)),
			};
		} catch(error) {
			return {error: 'GTL service error - ' + error};
		}
	}

	async getComponentRules(params) {
		// return await this.getRulesUsingSoap(params);

		// specifying a ticket designator or departure date often makes
		// rules not applicable, so they should not be included
		const cmdMods = {
			'D': moment.utc(params.ticketingDt).format('DDMMMYY'),
			'A': params.airline,
			'FB': params.fareBasis,
		};

		let cmd = `FRN${params.origin}${params.destination}`;

		for(const [label, value] of Object.entries(cmdMods)) {
			if(value) {
				cmd += `/${label}-${value}`;
			}
		}

		if (!this.cmdToParsedRules[cmd]) {
			this.cmdToParsedRules[cmd] = await this.getRulesUsingSoap(params);
			// These properties are used to construct client response, PHP code
			// stored these using DumpStorage
			this.cmdToParsedRules[cmd].dumpCmd = 'RETRIEVED VIA SOAP';
			this.cmdToParsedRules[cmd].cmd = cmd;
		}

		return this.cmdToParsedRules[cmd];
	}

	/** @param pricingStores = [AmadeusPricingStoreAdapter::transform(), ...] */
	async execute(pricingStores, itinerary) {
		const ruleRecs = [];
		for(const [i, store] of Object.entries(pricingStores)) {
			for(const [j, ptcBlock] of Object.entries(store.pricingBlockList)) {
				const fc = ptcBlock['fareInfo']['fareConstruction'];
				const fareListRec = ImportPnrCommonFormatAdapter.collectFcFares(fc, itinerary);

				if(fareListRec.error) {
					return {'error': `Failed to collect ${i} - ${j} -th FC fares: ${fareListRec.error}`};
				}

				const numToSeg = itinerary.reduce((obj, itin) => {
					obj[itin.segmentNumber] = itin;
					return obj;
				}, {});

				for(const [k, fare] of Object.entries(fareListRec.fares)) {
					const dprtSeg = numToSeg[_.first(fare['segmentNumbers'])];
					const dstnSeg = numToSeg[_.last(fare['segmentNumbers'])];

					const parsed = await this.getComponentRules({
						'origin': dprtSeg['departureAirport'],
						'destination': dstnSeg['destinationAirport'],
						'ticketingDt': ptcBlock['lastDateToPurchase']['parsed'],
						'airline': ptcBlock['validatingCarrier'],
						'fareBasis': fare['fareBasis'],
					});

					if (parsed.error) {
						return {
							'error': `Failed to parse ${i}-${j}-${k}-th fare rules: ${parsed.error}`,
						};
					}

					ruleRecs.push({
						fareComponent: fare,
						pricingNumber: store.quoteNumber,
						subPricingNumber: j + 1,
						fareComponentNumber: fare.componentNumber,
						dumpCmd: parsed.dumpCommand,
						cmd: parsed.cmd,
						sections: parsed.sections,
					});
				}
			}
		}

		return {'data': ruleRecs};
	}
}

module.exports = AmadeusGetStatelessRulesAction;