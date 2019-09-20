const AmadeusClient = require('../../../GdsClients/AmadeusClient');
const ImportPnrCommonFormatAdapter = require('../../Rbs/Process/Common/ImportPnr/ImportPnrCommonFormatAdapter.js');
const AbstractGdsAction = require('./AbstractGdsAction');
const _ = require('lodash');
const moment = require('moment');
const FareRuleSectionParser = require('../../Gds/Parsers/Common/FareRuleSectionParser');
const Rej = require('klesun-node-tools/src/Rej.js');

/**
 * get static rules by origin/destination/fareBasis/date/etc...
 * using >FRN...; command (or SOAP function)
 */
class AmadeusGetStatelessRulesAction extends AbstractGdsAction {

	constructor({
		amadeus = AmadeusClient.makeCustom(),
	} = {}) {
		super();
		this.cmdToParsedRules = [];
		this.amadeus = amadeus;
	}

	async getRulesUsingSoap(params) {
		try {
			const result = await this.amadeus.getFareRules(this.session.getGdsData(), params);

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
			D: moment.utc(params.ticketingDt).format('DDMMMYY'),
			A: params.airline,
			FB: params.fareBasis,
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
		for (let i = 0; i < pricingStores.length; i++) {
			const store = pricingStores[i];

			for (let j = 0; j <store.pricingBlockList.length; j++) {
				const ptcBlock = store.pricingBlockList[j];
				const ticketingDt = (ptcBlock.lastDateToPurchase || {}).parsed || null;
				if (!ticketingDt) {
					return Rej.UnprocessableEntity('Ticketing date not available in PTC #' + (j + 1));
				}

				const fc = ptcBlock['fareInfo']['fareConstruction'];
				const fareListRec = ImportPnrCommonFormatAdapter.collectFcFares(fc, itinerary);

				if (fareListRec.error) {
					return {error: `Failed to collect ${i} - ${j} -th FC fares: ${fareListRec.error}`};
				}

				const numToSeg = itinerary.reduce((obj, itin) => {
					obj[itin.segmentNumber] = itin;
					return obj;
				}, {});

				for (let k = 0; k <fareListRec.fares.length; k++) {
					const fare = fareListRec.fares[k];

					const dprtSeg = numToSeg[_.first(fare['segmentNumbers'])];
					const dstnSeg = numToSeg[_.last(fare['segmentNumbers'])];

					const parsed = await this.getComponentRules({
						origin: dprtSeg['departureAirport'],
						destination: dstnSeg['destinationAirport'],
						ticketingDt: ticketingDt,
						airline: ptcBlock['validatingCarrier'],
						fareBasis: fare['fareBasis'],
					});

					if (parsed.error) {
						return {
							error: `Failed to parse ${i}-${j}-${k}-th fare rules: ${parsed.error}`,
						};
					}

					ruleRecs.push({
						fareComponent: fare,
						pricingNumber: store.quoteNumber,
						subPricingNumber: j + 1,
						fareComponentNumber: fare.componentNumber.toString(),
						dumpCmd: parsed.dumpCmd,
						cmd: parsed.cmd,
						sections: parsed.sections,
					});
				}
			}
		}

		return {data: ruleRecs};
	}
}

module.exports = AmadeusGetStatelessRulesAction;
