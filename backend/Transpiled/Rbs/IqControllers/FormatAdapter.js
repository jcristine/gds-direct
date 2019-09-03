
const DateTime = require('../../Lib/Utils/DateTime.js');
const Fp = require('../../Lib/Utils/Fp.js');
const ApolloReservationItineraryParser = require('../../Gds/Parsers/Apollo/Pnr/ItineraryParser.js');
const SsrBlockParser = require('../../Gds/Parsers/Apollo/Pnr/SsrBlockParser.js');
const ImportPnrCommonFormatAdapter = require('../../Rbs/Process/Common/ImportPnr/ImportPnrCommonFormatAdapter.js');
const ItineraryParser = require('../../Gds/Parsers/Sabre/Pnr/ItineraryParser.js');

const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * converts data from our internal structure
 * to the structure for the api users
 *
 * with this we can afford to change field names in parser
 * without need for clients to handle format change
 */
class FormatAdapter
{
	static transformSabreAirSegment($parsed, $baseDate)  {
		let $segment;

		$segment = this.adaptSabreSegmentParseForClient($parsed);
		if ($baseDate !== null) {
			$segment = this.addFullDateToSabreSegment($segment, $baseDate);
		}
		return $segment;
	}

	static adaptSabreItineraryParseForClient($parse, $baseDate)  {
		return $parse
			.filter(s => s['segmentType'] === ItineraryParser.SEGMENT_TYPE_ITINERARY_SEGMENT)
			.map(s => this.transformSabreAirSegment(s, $baseDate));
	}

	/**
     * @param array $parse - output of the
     * @see SabreReservationParser::parse()
     */
	static adaptSabrePnrParseForClient($parse, $creationDate)  {
		let $baseDate, $common;
		$baseDate = (($parse['parsedData']['pnrInfo'] || {})['date'] || {})['parsed'] || $creationDate || null;
		$baseDate = $baseDate
			? php.date('Y-m-d', php.strtotime('-2 day', php.strtotime($baseDate)))
			: null;
		const pnrInfo = $parse['parsedData']['pnrInfo'];
		$common = {
			passengers: ($parse['parsedData']['passengers']['parsedData'] || {})['passengerList'] || [],
			itinerary: this.adaptSabreItineraryParseForClient($parse['parsedData']['itinerary'] || [], $baseDate),
			remarks: this.transformSabreRemarks($parse['parsedData']['remarks'] || []),
			pnrInfo: !pnrInfo ? null : {
				pcc: pnrInfo['pcc'],
				homePcc: pnrInfo['homePcc'],
				agentInitials: pnrInfo['agentInitials'],
				reservationDt: {
					full: (pnrInfo['date'] || {})['parsed']
						? pnrInfo['date']['parsed']
                            +' '+pnrInfo['time']['parsed']
						: null,
				},
				recordLocator: pnrInfo['recordLocator'],
			},
		};
		$common = ImportPnrCommonFormatAdapter.addContextDataToPaxes($common);
		return $common;
	}


	/**
     * @param $segment = ItineraryParser::parseSegmentLine()
     */
	static adaptSabreSegmentParseForClient($segment)  {
		let $daysOfWeek, $dprt, $dstn;

		$daysOfWeek = null;
		if ($dprt = ($segment['departureDayOfWeek'] || {})['parsed']) {
			$daysOfWeek = $dprt;
			if ($dstn = ($segment['destinationDayOfWeek'] || {})['parsed']) {
				$daysOfWeek += '\/'+$dstn;
			}
		}

		return {
			segmentNumber: $segment['segmentNumber'],
			airline: $segment['airline'],
			flightNumber: $segment['flightNumber'],
			bookingClass: $segment['bookingClass'],
			departureDate: $segment['departureDate'],
			departureTime: $segment['departureTime'],
			daysOfWeek: $daysOfWeek,
			departureAirport: $segment['departureAirport'],
			destinationAirport: $segment['destinationAirport'],
			marriage: $segment['marriage'] || null,
			segmentStatus: $segment['segmentStatus'],
			seatCount: $segment['seatCount'],
			eticket: $segment['eticket'] ? true : false,
			destinationDate: (($segment['destinationDate'] || {})['raw'] || '') !== ''
				? $segment['destinationDate']
				: $segment['departureDate'],
			destinationTime: $segment['destinationTime'],
			confirmedByAirline: !php.empty($segment['confirmationNumber']),
			confirmationAirline: $segment['confirmationAirline'],
			confirmationNumber: $segment['confirmationNumber'],
			operatedBy: $segment['operatedBy'],
			operatedByCode: $segment['operatedByCode'],
			raw: $segment['raw'],
		};
	}

	static addFullDateToSabreSegment($segment, $baseDate)  {
		let $destinationDate;
		$destinationDate = $segment['destinationDate']['parsed']
            || $segment['departureDate']['parsed'];
		$segment['departureDt'] = {
			raw: $segment['departureDate']['raw']+' '+$segment['departureTime']['raw'],
			parsed: $segment['departureDate']['parsed']+' '+$segment['departureTime']['parsed'],
			full: $segment['departureDate']['parsed'] && $baseDate
				? DateTime.decodeRelativeDateInFuture($segment['departureDate']['parsed'], $baseDate)
                    +' '+$segment['departureTime']['parsed']+':00'
				: null,
		};
		$segment['destinationDt'] = {
			raw: $segment['destinationDate']['raw']+' '+$segment['destinationTime']['raw'],
			parsed: $segment['destinationDate']['parsed']+' '+$segment['destinationTime']['parsed'],
			full: $destinationDate && $baseDate
				? DateTime.decodeRelativeDateInFuture($destinationDate, $baseDate)
                    +' '+$segment['destinationTime']['parsed']+':00'
				: null,
		};
		return $segment;
	}

	/**
     * @param array $parse - output of the
     * @see ApolloReservationParser::parse()
     */
	static adaptApolloPnrParseForClient($parse, $baseDate)  {
		let $common;
		$common = {
			dataExistsInfo: {
				dividedBookingExists: $parse['dataExistsInfo']['dividedBookingExists'],
				frequentFlyerDataExists: $parse['dataExistsInfo']['frequentFlyerDataExists'],
				globalInformationExists: $parse['dataExistsInfo']['globalInformationExists'],
				itineraryRemarksExist: $parse['dataExistsInfo']['itineraryRemarksExist'],
				linearFareDataExists: $parse['dataExistsInfo']['linearFareDataExists'],
				miscDocumentDataExists: $parse['dataExistsInfo']['miscDocumentDataExists'],
				profileAssociationsExist: $parse['dataExistsInfo']['profileAssociationsExist'],
				seatDataExists: $parse['dataExistsInfo']['seatDataExists'],
				tinRemarksExist: $parse['dataExistsInfo']['tinRemarksExist'],
				nmePricingRecordsExist: $parse['dataExistsInfo']['nmePricingRecordsExist'],
				eTicketDataExists: $parse['dataExistsInfo']['eTicketDataExists'],
			},

			pnrInfo: php.isset($parse['headerData']['reservationInfo'])
				? {
					recordLocator: $parse['headerData']['reservationInfo']['recordLocator'],
					focalPointInitials: $parse['headerData']['reservationInfo']['focalPointInitials'],
					agencyToken: $parse['headerData']['reservationInfo']['agencyToken'],
					agentToken: $parse['headerData']['reservationInfo']['agentToken'],
					agencyId: $parse['headerData']['reservationInfo']['agencyId'],
					arcNumber: $parse['headerData']['reservationInfo']['arcNumber'],
					reservationDate: {
						parsed: $parse['headerData']['reservationInfo']['reservationDate']['parsed'],
					},
				} : null,

			passengers: $parse['passengers']['passengerList'] || [],

			itinerary: this.adaptApolloItineraryParseForClient($parse['itineraryData'] || [], $baseDate),

			adrsData: php.isset($parse['adrsData'])
				? {
					name: $parse['adrsData']['name'],
					addressLine1: $parse['adrsData']['addressLine1'],
					addressLine2: $parse['adrsData']['addressLine2'],
					addressLine3: $parse['adrsData']['addressLine3'],
					zipCode: $parse['adrsData']['zipCode'],
				} : null,

			dlvrData: php.isset($parse['dlvrData'])
				? {
					name: $parse['dlvrData']['name'],
					addressLine1: $parse['dlvrData']['addressLine1'],
					addressLine2: $parse['dlvrData']['addressLine2'],
					addressLine3: $parse['dlvrData']['addressLine3'],
					zipCode: $parse['dlvrData']['zipCode'],
				} : null,

			formOfPayment: php.isset($parse['formOfPaymentData'])
				? {
					formOfPayment: $parse['formOfPaymentData']['formOfPayment'],
					ccType: $parse['formOfPaymentData']['ccType'] || null,
					ccNumber: $parse['formOfPaymentData']['ccNumber'] || null,
					expirationDate: php.isset($parse['formOfPaymentData']['expirationDate']['parsed'])
						? {
							parsed: $parse['formOfPaymentData']['expirationDate']['parsed'],
							raw: $parse['formOfPaymentData']['expirationDate']['raw'],
						} : null,
					approvalCode: $parse['formOfPaymentData']['approvalCode'] || null,
				} : null,

			tktgData: php.isset($parse['tktgData'])
				? {
					fpInitials: $parse['tktgData']['fpInitials'] || null,
				} : null,

			atfqData: Fp.map(($record) => {
				return {
					lineNumber: $record['lineNumber'],
					atfqType: $record['atfqType'],
					pricingModifiers: $record['pricingModifiers'],
					FQ: php.isset($record['FQ']) ? {
						fare: {
							currency: $record['FQ']['fare']['currency'],
							amount: $record['FQ']['fare']['amount'],
						},
						taxList: Fp.map(($taxRecord) => {
							return {
								currency: $taxRecord['currency'],
								amount: $taxRecord['amount'],
								taxType: $taxRecord['taxType'],
							};
						}, $record['FQ']['taxList']),
						netPrice: {
							currency: $record['FQ']['netPrice']['currency'],
							amount: $record['FQ']['netPrice']['amount'],
						},
					} : null,
				};
			}, $parse['atfqData'] || []),

			ssrData: Fp.map(($ssr) => {
				let $ssrData;
				$ssrData = null;
				if ($ssr['ssrCode'] === 'DOCS') {
					$ssrData = {
						travelDocType: $ssr['data']['travelDocType'],
						issuingCountry: $ssr['data']['issuingCountry'],
						travelDocNumber: $ssr['data']['travelDocNumber'],
						nationality: $ssr['data']['nationality'],
						birthDate: $ssr['data']['dob'],
						gender: $ssr['data']['gender'],
						expirationDate: $ssr['data']['expirationDate']
							? {raw: $ssr['data']['expirationDate']}
							: null,
						lastName: $ssr['data']['lastName'],
						firstName: $ssr['data']['firstName'],
						middleName: $ssr['data']['middleName'] || null,
						primaryPassportHolderToken: $ssr['data']['primaryPassportHolderToken'] || null,
						paxNum: $ssr['data']['paxNum'],
						paxIsInfant: $ssr['data']['paxIsInfant'] ? true : false,
						paxName: $ssr['data']['paxName'],
					};
				} else if ($ssr['ssrCode'] === 'DOCA') {
					$ssrData = {
						addressType: $ssr['data']['addressType'],
						country: $ssr['data']['country'],
						addressDetails: $ssr['data']['addressDetails'],
						city: $ssr['data']['city'],
						province: $ssr['data']['province'],
						postalCode: $ssr['data']['postalCode'],
						paxNum: $ssr['data']['paxNum'],
						paxIsInfant: $ssr['data']['paxIsInfant'] ? true : false,
						paxName: $ssr['data']['paxName'],
					};
				} else if ($ssr['ssrCode'] === 'DOCO') {
					$ssrData = {
						placeOfBirth: $ssr['data']['placeOfBirth'],
						travelDocType: $ssr['data']['travelDocType'],
						travelDocNumber: $ssr['data']['travelDocNumber'],
						issuingCountry: $ssr['data']['issuingCountry'],
						dateOfBirth: $ssr['data']['dob'],
						countryWhereApplies: $ssr['data']['countryWhereApplies'],
						paxNum: $ssr['data']['paxNum'],
						paxIsInfant: $ssr['data']['paxIsInfant'] ? true : false,
						paxName: $ssr['data']['paxName'],
					};
				} else if (
					SsrBlockParser.isMealSsrCode($ssr['ssrCode']) ||
                    SsrBlockParser.isDisabilitySsrCode($ssr['ssrCode'])
				) {
					$ssrData = {
						airline: $ssr['data']['airline'],
						departureAirport: $ssr['data']['departureAirport'],
						destinationAirport: $ssr['data']['destinationAirport'],
						flightNumber: $ssr['data']['flightNumber'],
						bookingClass: $ssr['data']['bookingClass'],
						departureDate: {
							parsed: $ssr['data']['departureDate']['parsed'],
						},
						seatCount: $ssr['data']['seatCount'],
						paxIsInfant: $ssr['data']['paxIsInfant'],
						paxName: $ssr['data']['paxName'],
						comment: $ssr['data']['comment'],
					};
				}
				return {
					lineNumber: $ssr['lineNumber'],
					ssrCode: $ssr['ssrCode'],
					data: $ssrData,
					line: $ssr['line'],
				};
			}, $parse['ssrData'] || []),

			remarks: this.transformApolloRemarks($parse['remarks'] || []),

			acknData: Fp.map(($record) => {
				return {
					lineNumber: $record['number'],
					airline: $record['airline'],
					confirmationNumber: $record['confirmationNumber'],
					dt: {
						parsed: $record['date']['parsed'],
					},
				};
			}, $parse['acknData'] || []),
		};
		$common = ImportPnrCommonFormatAdapter.addContextDataToPaxes($common);
		return $common;
	}

	/** @param $segment = ApolloReservationItineraryParser::parseSegmentLine() */
	static adaptApolloSegmentParseForClient($segment)  {
		return {
			segmentNumber: $segment['segmentNumber'],
			airline: $segment['airline'],
			flightNumber: $segment['flightNumber'],
			bookingClass: $segment['bookingClass'],
			departureDate: {parsed: $segment['departureDate']['parsed'], raw: $segment['departureDate']['raw']}, // in "m-d" format
			departureTime: {parsed: $segment['departureTime']['parsed'], raw: $segment['departureTime']['raw']}, // in "H:i" format
			departureAirport: $segment['departureAirport'],
			destinationAirport: $segment['destinationAirport'],
			segmentStatus: $segment['segmentStatus'],
			seatCount: $segment['seatCount'],
			// add to departure date to get the destination date
			dayOffset: $segment['dayOffset'],
			eticket: $segment['eticket'] ? true : false,
			daysOfWeek: $segment['daysOfWeek']['parsed'],
			destinationTime: {parsed: $segment['destinationTime']['parsed']},
			confirmedByAirline: $segment['confirmedByAirline'] ? true : false,
			operatedBy: $segment['operatedBy'] || null,
			operatedByCode: $segment['operatedByCode'] || null,
			marriage: $segment['marriage'],
			raw: $segment['raw'],
		};
	}

	static addFullDateToApolloSegment($segment, $baseDate)  {
		let $fullDepartureDate, $fullDestinationDate;
		$fullDepartureDate = DateTime.decodeRelativeDateInFuture($segment['departureDate']['parsed'], $baseDate);
		$fullDestinationDate = $fullDepartureDate
			? php.date('Y-m-d', php.strtotime($fullDepartureDate) + $segment.dayOffset * 24 * 60 * 60)
			: null;
		$segment['destinationDate'] = {
			//            'raw' => $parsedData['departureDate']['raw'].' +'.$parsedData['dayOffset'],
			parsed: $fullDestinationDate
				? php.date('m-d', php.strtotime($fullDestinationDate))
				: null,
		};
		$segment['departureDt'] = {
			//            'raw' => $segment['departureDate']['raw'].' '.$segment['departureTime']['raw'],
			parsed: $segment['departureDate']['parsed']+' '+$segment['departureTime']['parsed'],
			full: $fullDepartureDate
				? $fullDepartureDate+' '+$segment['departureTime']['parsed']+':00'
				: null,
		};
		$segment['destinationDt'] = {
			//            'raw' => $segment['destinationDate']['raw'].' '.$segment['destinationTime']['raw'],
			parsed: $segment['destinationDate']['parsed']+' '+$segment['destinationTime']['parsed'],
			full: $fullDestinationDate
				? $fullDestinationDate+' '+$segment['destinationTime']['parsed']+':00'
				: null,
		};
		return $segment;
	}

	static transformApolloAirSegment($parsed, $baseDate)  {
		let $segment;
		$segment = this.adaptApolloSegmentParseForClient($parsed);
		if ($baseDate !== null) {
			$segment = this.addFullDateToApolloSegment($segment, $baseDate);
		}
		return $segment;
	}

	static adaptApolloItineraryParseForClient($parse, $baseDate)  {
		return php.array_values(Fp.map(($parsedSegment) => {
			return this.transformApolloAirSegment($parsedSegment, $baseDate);
		}, Fp.filter(($s) => {
			return $s['segmentType'] === ApolloReservationItineraryParser.SEGMENT_TYPE_ITINERARY_SEGMENT;
		}, $parse || [])));
	}

	/** @param array $remarks = [GenericRemarkParser::parse(), ...] */
	static transformApolloRemarks($remarks)  {
		return Fp.map(($remark) => {
			return {
				lineNumber: $remark['lineNumber'],
				remarkType: $remark['remarkType'],
				data: $remark['data'],
			};
		}, $remarks);
	}

	/** @param array $remarks = [GenericRemarkParser::parse(), ...] */
	static transformSabreRemarks($remarks)  {
		return Fp.map(($remark) => {
			return {
				lineNumber: $remark['lineNumber'],
				remarkType: $remark['remarkType'],
				data: $remark['data'],
			};
		}, $remarks);
	}
}
module.exports = FormatAdapter;
