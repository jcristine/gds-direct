const Errors = require('../GdsDirect/Errors.js');

const DateTime = require('../../Lib/Utils/DateTime.js');
const Fp = require('../../Lib/Utils/Fp.js');
const StringUtil = require('../../Lib/Utils/StringUtil.js');
const AbstractGdsAction = require('./AbstractGdsAction.js');
const php = require('klesun-node-tools/src/Transpiled/php.js');
const AirAvailabilityParser = require('../../Gds/Parsers/Sabre/AirAvailabilityParser.js');
const matchAll = require('../../../Utils/Str').matchAll;
const SabreClient = require('../../../GdsClients/SabreClient');

// 'D7 F7 A7 J7 R7 I7 W7 P7 Y47* H47* K47* M47* L47* G47* V47* S47* N47* Q47* O47*-*WL'
// 'D7 F7 A7 J7 R7 I7 W7 P7 Y75* H75* K75* M75* L75* G75* V75* S75* N75* Q75* O75*-*WL'
const parseWaitlist = output => {
	const clsReg = /([A-Z])([A-Z0-9])([A-Z0-9]|)(\*)?\s*/;
	const fullReg = new RegExp('^((?:' + clsReg.source + ')*)-\\*WL$');
	const match = output.match(fullReg);
	if (match) {
		const classes = matchAll(clsReg, match[1])
			.map((_,cls,num,wlNum,wlMark) => ({
				bookingClass: cls,
				seatCount: num,
				waitlistSeatCount: wlNum,
				waitlistMark: wlMark,
			}));
		return {classes};
	} else {
		return null;
	}
};

class SabreBuildItineraryAction extends AbstractGdsAction {
	constructor({
		sabre = SabreClient.makeCustom(),
		session, baseDate = null,
	} = {}) {
		super();
		this.$useXml = true;
		this.sabre = sabre;
		this.session = session;
		this.baseDate = baseDate;
	}

	useXml($flag) {

		this.$useXml = $flag;
		return this;
	}

	async executeViaTerminal($itinerary, $isParserFormat) {
		let $i, $segment, $cmd, $output, $errorType, $tplData, waitlist;

		$itinerary = Fp.map($segment => {
			const $date = $isParserFormat
				? $segment['departureDate']['raw']
				: this.constructor.formatSabreDate($segment['departureDate']);

			return {...$segment, departureDate: $date};
		}, $itinerary);

		for ([$i, $segment] of Object.entries($itinerary)) {
			$cmd = StringUtil.format('0{airline}{flightNumber}{bookingClass}{departureDate}{departureAirport}{destinationAirport}{segmentStatus}{seatCount}', $segment);
			$output = (await this.runCmd($cmd)).output;
			if ($output.match(/UNABLE - SYSTEM ERROR[\s\S]*CONTINUE WITH PNR CREATION/)) {
				$output = (await this.runCmd($cmd)).output;
			}
			if (!this.constructor.isOutputValid($output)) {
				if (this.constructor.isAvailabilityOutput($output)) {
					$errorType = Errors.REBUILD_NO_AVAIL;
				} else if (waitlist = parseWaitlist($output)) {
					$errorType = Errors.REBUILD_NO_AVAIL;
				} else {
					$errorType = Errors.REBUILD_GDS_ERROR;
				}
				$tplData = {
					segmentNumber: $i + 1,
					from: $segment['departureDate'],
					to: $segment['destinationAirport'],
					waitlist: waitlist,
					response: php.trim($output),
				};
				return {
					success: false,
					errorType: $errorType,
					errorData: $tplData,
				};
			}
		}
		// a workaround for Sabre CONTINUE WITH PNR CREATION auto-claim bug
		// happening on the next command after passive segment sell of some
		// airlines, for example: >0DY7088C20APRLAXARNGK1;
		const pnrCmdRec = await this.runCmd('*R');
		return {success: true, pnrCmdRec};
	}

	async executeViaXml(itinerary, isParserFormat) {
		const fallbackDt = php.is_callable(this.session.getStartDt) ? this.session.getStartDt() : php.date('Y-m-d');
		const baseDate = this.baseDate || fallbackDt;

		const params = {
			addAirSegments: itinerary.map(seg => {
				const departureDt = !isParserFormat ? seg.departureDate :
					DateTime.decodeRelativeDateInFuture(seg.departureDate.parsed, baseDate);

				return {
					airline: seg.airline,
					flightNumber: seg.flightNumber,
					bookingClass: seg.bookingClass,
					departureDt: departureDt,
					destinationDt: null, // needed if times specified
					departureAirport: seg.departureAirport,
					destinationAirport: seg.destinationAirport,
					segmentStatus: seg.segmentStatus,
					seatCount: seg.seatCount,
					marriage: seg.marriage,
					/**
					 * possibly it is "is married to next", dunno how we should
					 * process marriages between a marriage then though, so
					 * booking each marriage with a separate request for now
					 */
					isMarried: seg.marriage > 0 && seg.segmentStatus !== 'GK' ? true : undefined,
				};
			}),
			redisplay: true,
		};

		const result = await this.sabre.processPnr(this.session.getGdsData(), params);

		if (result.error) {
			return {
				success: false,
				airSegmentCount: result.newAirSegments.length,
				errorType: Errors.REBUILD_MULTISEGMENT, errorData: {response: result.error},
			};
		}

		return {
			success: true,
			airSegmentCount: result.newAirSegments.length,
			reservation: {
				itinerary: result.reservations,
			},
			/** @deprecated - use reservation, to match Apollo and importPnr format */
			itinerary: result.reservations,
		};
	}

	static isOutputValid($output) {
		let $filter;

		$filter = ['/',
			'\\s*',
			'(?<departureTime>\\d{2,4}[A-Z])',
			'\\s+',
			'(?<destinationTime>\\d{2,4}[A-Z])',
			'.+',
			'SEG\\s*(?<lastSegmentNumber>\\d+)',
			'/',
		];
		if (php.preg_match(php.implode('', $filter), $output)) {
			return true;
		}
		return false;
	}

	static formatSabreDate($dt) {

		return php.strtoupper(php.date('dM', php.strtotime($dt)));
	}

	static isAvailabilityOutput($output) {

		// if there are no seats available, Sabre
		// displays availability instead of error
		return !php.empty(AirAvailabilityParser.parse($output)['flights']);
	}

	/** @param $itinerary = ItineraryParser::parse() */
	async execute($itinerary, $isParserFormat = true) {
		if (this.$useXml) {
			return this.executeViaXml($itinerary, $isParserFormat);
		} else {
			return this.executeViaTerminal($itinerary, $isParserFormat);
		}
	}
}

module.exports = SabreBuildItineraryAction;
