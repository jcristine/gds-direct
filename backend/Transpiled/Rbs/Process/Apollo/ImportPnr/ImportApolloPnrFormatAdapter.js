
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');
const ApolloBaggageAdapter = require('../../../../Rbs/FormatAdapters/ApolloBaggageAdapter.js');
const ApolloPricingAdapter = require('../../../../Rbs/FormatAdapters/ApolloPricingAdapter.js');
const FormatAdapter = require('../../../../Rbs/IqControllers/FormatAdapter.js');
const ImportPnrCommonFormatAdapter = require('../../../../Rbs/Process/Common/ImportPnr/ImportPnrCommonFormatAdapter.js');
const php = require('../../../../phpDeprecated.js');

/**
 * transforms output of the ImportApolloPnrAction to a common for any GDS structure
 */
class ImportApolloPnrFormatAdapter
{
	// =====================
	//  1-st level
	// =====================

	/**
     * @param $baseDate string - date that is between reservation and first segment
     * @param array $parsedData = ApolloReservationParser::parse()
     */
	static transformReservation($parsedData, $baseDate)  {
		let $recentPast, $nearFuture, $nameRecords, $reservation, $pnrInfo;
		if (php.isset($parsedData['error'])) {
			return $parsedData;
		}
		$recentPast = !$baseDate ? null : php.date('Y-m-d', php.strtotime('-2 days', php.strtotime($baseDate))); // -2 for timezone error
		$nearFuture = !$baseDate ? null : php.date('Y-m-d', php.strtotime('+2 days', php.strtotime($baseDate))); // +2 for timezone error

		$nameRecords = $parsedData['passengers']['passengerList'] || [];
		$reservation = {};
		$pnrInfo = !php.empty($parsedData['headerData']['reservationInfo'])
			? this.transformPnrInfo($parsedData['headerData'], $nearFuture)
			: null;
		$reservation['pnrInfo'] = $pnrInfo;
		$reservation['passengers'] = $nameRecords;
		$reservation['itinerary'] = FormatAdapter.adaptApolloItineraryParseForClient($parsedData['itineraryData'] || [], $recentPast);
		$reservation['remarks'] = FormatAdapter.transformApolloRemarks($parsedData['remarks'] || []);
		$reservation['confirmationNumbers'] = Fp.map(($acknDataEl) => {
			return {
				'airline': $acknDataEl['airline'],
				'confirmationNumber': $acknDataEl['confirmationNumber'],
				'segmentNumber': null,
				'date': {
					'raw': $acknDataEl['date']['raw'],
					'parsed': $acknDataEl['date']['parsed'],
					'full': $pnrInfo ? DateTime.decodeRelativeDateInFuture($acknDataEl['date']['parsed'],
						$pnrInfo['reservationDate']['full']) : null,
				},
			};
		}, $parsedData['acknData'] || []);
		$reservation['dataExistsInfo'] = {
			'mileageProgramsExist': $parsedData['dataExistsInfo']['frequentFlyerDataExists'],
			'fareQuoteExists': $parsedData['dataExistsInfo']['linearFareDataExists'],
			'dividedBookingExists': $parsedData['dataExistsInfo']['dividedBookingExists'],
			'globalInformationExists': $parsedData['dataExistsInfo']['globalInformationExists'],
			'itineraryRemarksExist': $parsedData['dataExistsInfo']['itineraryRemarksExist'],
			'miscDocumentDataExists': $parsedData['dataExistsInfo']['miscDocumentDataExists'],
			'profileAssociationsExist': $parsedData['dataExistsInfo']['profileAssociationsExist'],
			'seatDataExists': $parsedData['dataExistsInfo']['seatDataExists'],
			'tinRemarksExist': $parsedData['dataExistsInfo']['tinRemarksExist'],
			'nmePricingRecordsExist': $parsedData['dataExistsInfo']['nmePricingRecordsExist'],
			'eTicketDataExists': $parsedData['dataExistsInfo']['eTicketDataExists'],
		};
		$reservation['dumpNumbers'] = $parsedData['dumpNumbers'] || null;
		$reservation = ImportPnrCommonFormatAdapter.addContextDataToPaxes($reservation);
		return $reservation;
	}

	static transformFormOfPaymentInfo($parsedData)  {
		let $type;
		$type = $parsedData['formOfPayment'] || null;
		if ($type == 'cc') {
			$type = 'creditCard';
		} else if ($type == 'check') {
			$type = 'cash';
		}
		return $type;
	}

	/** @param $parsedData = RetrieveFlightServiceInfoAction::execute() */
	static transformFlightServiceInfo($parsedData, $baseDate)  {
		return !php.isset($parsedData['error']) ? {
			'segments': Fp.map(($svcSegData) => {
				let $legs, $i, $legData, $leg, $fullDepartureDate, $relDate, $dayOffset;
				$legs = [];
				for ([$i, $legData] of Object.entries(php.array_values($svcSegData['legs']))) {
					$leg = {};
					$leg['departureTerminal'] = php.isset($svcSegData['departureTerminal']) && $i === 0
						? {
							'raw': $svcSegData['departureTerminal'],
							'parsed': $svcSegData['departureTerminal'],
						} : null;
					$leg['destinationTerminal'] = php.isset($svcSegData['arrivalTerminal']) && $i === php.count($svcSegData['legs']) - 1
						? {
							'raw': $svcSegData['arrivalTerminal'],
							'parsed': $svcSegData['arrivalTerminal'],
						}: null;
					$leg['departureAirport'] = $legData['departureAirport'];
					$leg['destinationAirport'] = $legData['destinationAirport'];
					$leg['meals'] = {
						'raw': $legData['mealOptions'],
						'parsed': $legData['mealOptionsParsed'],
					};
					$leg['smoking'] = php.preg_match(/NON-SMOKING/, $legData['inFlightServicesText']) ? false : true;
					$leg['aircraft'] = $legData['aircraft'];
					$leg['flightDuration'] = $legData['flightDuration'];
					$leg['miles'] = null;
					$fullDepartureDate = php.isset($legData['departureDate'])
						? DateTime.decodeRelativeDateInFuture($legData['departureDate'], $baseDate)
						: null;
					let $fullDestinationDate = null;
					const $firstLegDepartureDate = $legs.length > 0
						? $legs[0]['departureDt']['full']
						: $fullDepartureDate;

					if ($relDate = $legData['destinationDateInfo']['date'] || null) {
						$fullDestinationDate = DateTime.decodeRelativeDateInFuture($relDate, $baseDate);
					} else if ($firstLegDepartureDate) {
						$dayOffset = $legData['destinationDateInfo']['dayOffset'];
						if ($dayOffset !== null) {
							$fullDestinationDate = $firstLegDepartureDate
								? php.date('Y-m-d', php.strtotime('+'+$dayOffset+' day', php.strtotime($firstLegDepartureDate)))
								: null;
						}
					}
					$leg['departureDt'] = {
						'parsed': php.date('m-d', php.strtotime($fullDepartureDate))+' '+$legData['departureTime'],
						'full': $fullDepartureDate
							? $fullDepartureDate+' '+$legData['departureTime']+':00'
							: null,
					};
					$leg['destinationDt'] = {
						'parsed': php.date('m-d', php.strtotime($fullDestinationDate))+' '+$legData['destinationTime'],
						'full': $fullDestinationDate
							? $fullDestinationDate+' '+$legData['destinationTime']+':00'
							: null,
					};
					$legs.push($leg);}
				return {
					'segmentNumber': $svcSegData['segmentNumber'],
					'airline': $svcSegData['airline'],
					'flightNumber': $svcSegData['flightNumber'],
					'legs': $legs,
				};
			}, $parsedData['flightInfoSegments']),
			'dumpNumbers': $parsedData['dumpNumbers'] || null,
		} : $parsedData;
	}

	/** @param $airlineMcoRecords = GetMcoDataAction::execute()['records']
     * @param $htParsed = TicketHistoryParser::parse()
     * @param $nameRecords = GdsPassengerBlockParser::flattenPassengers() */
	static transformMcoData($airlineMcoRecords, $htParsed, $nameRecords)  {
		let $getFullNum, $fullNumToAirMcos, $allDocs, $mcoRecords, $doc, $airMco;
		$getFullNum = ($mco) => $mco['documentNumber'];
		$fullNumToAirMcos = Fp.groupBy($getFullNum, $airlineMcoRecords);
		$allDocs = php.array_merge($htParsed['currentTickets'], $htParsed['deletedTickets']);
		$mcoRecords = [];
		for ($doc of $allDocs) {
			if ($airMco = $fullNumToAirMcos[$doc['ticketNumber']][0] || null) {
				$mcoRecords.push({
					'type': 'AIRLINE_CHARGE',
					'airlineNumber': php.substr($airMco['documentNumber'], 0, 3),
					'documentNumber': php.substr($airMco['documentNumber'], 3),
					'status': null,
					'currency': $airMco['maskData']['baseFare']['currency'],
					'amount': $airMco['maskData']['baseFare']['amount'],
					'passengerName': $airMco['maskData']['passengerName'],
					'nameNumber': this.findPaxMatchingName($nameRecords, $airMco['maskData']['passengerName'])['nameNumber'] || null,
				});
			} else if (StringUtil.startsWith($doc['ticketNumber'], '890')) {
				$mcoRecords.push({
					'type': 'AGENCY_CHARGE',
					'airlineNumber': php.substr($doc['ticketNumber'], 0, 3),
					'documentNumber': php.substr($doc['ticketNumber'], 3),
					'status': null,
					'currency': $doc['currency'],
					'amount': $doc['amount'],
					'passengerName': $doc['lastName']+'/'+$doc['firstName'],
					'nameNumber': this.findPaxMatchingName($nameRecords, $doc['lastName']+'/'+$doc['firstName'], true)['nameNumber'] || null,
				});
			}}
		return {'mcoRecords': $mcoRecords};
	}

	static transformSeatInfo($parsedData, $passengers)  {
		let $flatPassengers, $seats, $segment, $seatData, $seat, $passengerNumber;
		if (php.isset($parsedData['error'])) {
			return $parsedData;
		}
		$flatPassengers = $passengers;
		$seats = [];
		for ($segment of $parsedData['seatSegments']) {
			for ($seatData of $segment['seats']) {
				$seat = {};
				$passengerNumber = $seatData['passengerNumber']
					? $seatData['passengerNumber']
					: $seatData['lineNumber'];
				$seat['segmentNumber'] = $segment['flightInfo']['segmentNumber'];
				$seat['passengerNameNumber'] = $flatPassengers[$passengerNumber - 1]['nameNumber'] || null;
				$seat['passengerName'] = $seatData['passengerName'];
				$seat['requestStatus'] = $seatData['requestStatus'];
				$seat['seatCode'] = $seatData['seatCode'];
				$seat['zone'] = $seatData['zone']['raw'];
				$seat['location'] = $seatData['location']['raw'];
				$seats.push($seat);}}
		return {'seats': $seats, 'dumpNumbers': $parsedData['dumpNumbers'] || null};
	}

	static transformFrequentFlyerInfo($parsedData, $passengers)  {
		let $flatPassengers, $programs, $passengerRecord, $codeRecord, $mp;
		if (php.isset($parsedData['error'])) {
			return $parsedData;
		}
		$flatPassengers = $passengers;
		$programs = [];
		for ($passengerRecord of $parsedData['paxMpRecords']) {
			for ($codeRecord of $passengerRecord['mileageProgramList']) {
				$mp = {};
				$mp['airline'] = $codeRecord['airline'];
				$mp['code'] = $codeRecord['code'];
				$mp['passengerNameNumber'] = $flatPassengers[$passengerRecord['passengerInfo']['passengerNumber'] - 1]['nameNumber'] || null;
				$mp['passengerName'] = $passengerRecord['passengerInfo']['passengerName'];
				$programs.push($mp);}}
		return {'mileagePrograms': $programs, 'dumpNumbers': $parsedData['dumpNumbers'] || null};
	}

	static transformRepeatedItineraryInfo($parsedData, $baseDate)  {
		return !php.isset($parsedData['error']) ? {
			'dumpNumber': $parsedData['dumpNumber'] || null,
			'isSameAsOriginal': $parsedData['isSameAsOriginal'] || null,
			'isReadyToSell': $parsedData['isReadyToSell'] || null,
			'itinerary': FormatAdapter.adaptApolloItineraryParseForClient($parsedData['itinerary'] || [], $baseDate),
			'dumpNumbers': $parsedData['dumpNumbers'] || null,
		} : $parsedData;
	}

	static nameMatchesPax($paxName, $pax, $partial)  {
		let $lastName, $firstName;
		[$lastName, $firstName] = php.array_pad(php.explode('/', $paxName), 2, '');
		if (!$partial) {
			return $lastName === $pax['lastName']
                && $firstName === $pax['firstName'];
		} else {
			return StringUtil.startsWith($pax['lastName'], $lastName)
                && StringUtil.startsWith($pax['firstName'], $firstName);
		}
	}

	static findPaxMatchingName($flatPassengers, $name, $partial)  {
		let $matching, $pax;
		$matching = [];
		for ($pax of $flatPassengers) {
			if (this.nameMatchesPax($name, $pax, $partial)) {
				$matching.push($pax);
			}}
		return php.count($matching) === 1 ? $matching[0] : null;
	}

	static addNameNumberToSsrs($docSsrList, $flatPassengers)  {
		let $i, $paxName, $pax;
		for ($i = 0; $i < php.count($docSsrList); ++$i) {
			$paxName = $docSsrList[$i]['data']['paxName'] || null;
			if ($paxName) {
				$pax = this.findPaxMatchingName($flatPassengers, $paxName);
			} else if (php.count($flatPassengers) === 1) {
				$pax = $flatPassengers[0];
			} else {
				$pax = null;
			}
			if (php.isset($docSsrList[$i]['data'])) {
				$docSsrList[$i]['data']['passengerNameNumber'] = $pax ? $pax['nameNumber'] : null;
			}
			delete($docSsrList[$i]['data']['paxNum']);
			delete($docSsrList[$i]['data']['paxName']);
		}
		return $docSsrList;
	}

	/**
     * @param array $components = FqnParser::parse()['components']
     * @param array $itinerary = ApolloReservationItineraryParser::parse()['parsedData']
     */
	static transformFareList($components, $itinerary)  {
		let $fareComponents, $i, $component, $segmentNumbers, $first, $rSeg;
		$fareComponents = [];
		for ([$i, $component] of Object.entries($components)) {
			$segmentNumbers = [];
			$first = true;
			while ($rSeg = php.array_shift($itinerary)) {
				if ($first) {
					$first = false;
					if ($rSeg['departureAirport'] === $component['departureAirport']) {
						$segmentNumbers.push($rSeg['segmentNumber']);
					} else {
						break;
					}
				} else {
					$segmentNumbers.push($rSeg['segmentNumber']);
				}
				if ($rSeg['destinationAirport'] === $component['destinationAirport']) {
					break;
				}
			}
			if (!$segmentNumbers) {
				return {'error': 'Failed to match '+$i+'-th fare to segments'};
			}
			$fareComponents.push({
				'componentNumber': $component['componentNumber'],
				'segmentNumbers': $segmentNumbers,
				'departureAirport': $component['departureAirport'],
				'destinationAirport': $component['destinationAirport'],
				'fareBasis': $component['fareBasis'],
			});}
		return {'fareList': $fareComponents};
	}

	static transformFareComponents($restoredPricing, $itinerary)  {
		let $dumpNumbers, $fareListRecords, $fareListRecord, $commonRecord, $error;
		if (php.isset($restoredPricing['error'])) {
			return $restoredPricing;
		}
		$dumpNumbers = [];
		$fareListRecords = [];
		for ($fareListRecord of $restoredPricing['fareListRecords'] || []) {
			$dumpNumbers.push($fareListRecord['dumpNumber']);
			if (!php.isset($fareListRecord['error'])) {
				$commonRecord = this.transformFareList($fareListRecord['fareList'], $itinerary);
				if ($error = $commonRecord['error'] || null) {
					$fareListRecord['error'] = $error;
				} else {
					$fareListRecord['fareList'] = $commonRecord['fareList'];
				}
			}
			$fareListRecords.push($fareListRecord);}
		if (php.count($fareListRecords) === 0) {
			return {'error': 'noData'};
		}
		return {
			'data': $fareListRecords,
			'dumpNumbers': $dumpNumbers,
		};
	}

	static transformFareRules($restoredPricing, $sectionCode)  {
		let $dumpNumbers, $fareRuleRecords, $errors, $fareListRecord, $fareComponent, $record, $rule, $error;
		if (php.isset($restoredPricing['error'])) {
			return $restoredPricing;
		}
		$dumpNumbers = [];
		$fareRuleRecords = [];
		$errors = [];
		for ($fareListRecord of $restoredPricing['fareListRecords'] || []) {
			if (!php.isset($fareListRecord['error'])) {
				for ($fareComponent of $fareListRecord['fareList']) {
					$record = {
						'pricingNumber': $fareListRecord['pricingNumber'],
						'subPricingNumber': $fareListRecord['subPricingNumber'],
						'fareComponentNumber': $fareComponent['componentNumber'],
					};
					if ($rule = $fareComponent['ruleSections'][$sectionCode] || null) {
						if (php.isset($rule['error'])) {
							$errors.push($rule['error']);
							$record['error'] = $rule['error'];
						} else {
							$dumpNumbers.push($rule['dumpNumber']);
							$record['dumpNumber'] = $rule['dumpNumber'];
						}
						$record['data'] = $rule['parsed'] || null;
						$record['doesApply'] = $rule['doesApply'] || false;
						$fareRuleRecords.push($record);
					}}
			} else {
				$fareRuleRecords.push($fareListRecord);
			}}
		if ($errors && php.count($errors) === php.count($fareRuleRecords)) {
			$error = php.array_unique($errors) === ['ruleNotFound']
				? 'noData'
				: php.implode(php.PHP_EOL, $errors);
			return {
				'error': $error,
				'dumpNumbers': $dumpNumbers,
			};
		} else {
			return {
				'data': $fareRuleRecords,
				'dumpNumbers': $dumpNumbers,
			};
		}
	}

	/**
     * @param array $restoredPricing = RestorePricingsAction::execute()
     */
	static transformSummedFareRules($restoredPricing)  {
		let $dumpNumbers, $fareRuleRecords, $fareListRecord, $fareComponent, $dumpNumber, $ruleRecord;
		if (php.isset($restoredPricing['error'])) {
			return $restoredPricing;
		}
		$dumpNumbers = [];
		$fareRuleRecords = [];
		for ($fareListRecord of $restoredPricing['fareListRecords'] || []) {
			if (!php.isset($fareListRecord['error'])) {
				for ($fareComponent of $fareListRecord['fareList']) {
					$dumpNumber = $fareComponent['ruleDumpNumber'];
					$dumpNumbers.push($dumpNumber);
					$ruleRecord = ImportPnrCommonFormatAdapter.transformSummedFareRules($fareComponent, $fareComponent['ruleSections'], $fareListRecord);
					$ruleRecord['dumpNumber'] = $dumpNumber;
					$fareRuleRecords.push($ruleRecord);}
			} else {
				$fareRuleRecords.push($fareListRecord);
			}}
		return {
			'data': $fareRuleRecords,
			'dumpNumbers': $dumpNumbers,
		};
	}

	// ======================
	//  2-nd level
	// =======================

	/** @see ApolloReservationHeaderParser::parsePnrHeaderLine() */
	static transformPnrInfo($headerData, $fetchedDt)  {
		let $parsedData, $pnrInfo;
		$parsedData = $headerData['reservationInfo'];
		$pnrInfo = {};
		$pnrInfo['recordLocator'] = $parsedData['recordLocator'];
		$pnrInfo['agentInitials'] = $parsedData['focalPointInitials'];
		$pnrInfo['receivedFrom'] = $headerData['agentName'] || null;
		$pnrInfo['reservationDate'] = php.isset($parsedData['reservationDate']) ? {
			'raw': $parsedData['reservationDate']['raw'],
			'parsed': $parsedData['reservationDate']['parsed'],
			'full': DateTime.decodeRelativeDateInPast($parsedData['reservationDate']['parsed'], $fetchedDt),
		} : null;
		$pnrInfo['agencyInfo'] = {
			'agencyId': $parsedData['agencyId'],
			'agencyToken': $parsedData['agencyToken'],
			'agentToken': $parsedData['agentToken'],
			'arcNumber': $parsedData['arcNumber'],
		};
		return $pnrInfo;
	}

	/** @param $ticketData = TicketParser::parse() */
	static transformTicket($ticketData, $reservationDate)  {
		let $ticket, $numberTokens;
		if (!php.isset($ticketData['error'])) {
			$ticket = {};

			$numberTokens = php.explode('/', $ticketData['header']['ticketNumber']);

			$ticket['ticketNumber'] = php.str_replace(' ', '', $numberTokens[0]);
			$ticket['ticketNumberExtension'] = $numberTokens[1] || null;
			$ticket['dumpNumber'] = $ticketData['dumpNumber'] || null;
			$ticket['passengerName'] = $ticketData['header']['passengerName'];
			$ticket['issueDate'] = {
				'raw': $ticketData['header']['issueDate']['raw'],
				'parsed': $ticketData['header']['issueDate']['parsed'],
				'full': $ticketData['header']['issueDate']['parsed'],
			};
			$ticket['pcc'] = $ticketData['header']['pcc'];
			$ticket['tourCode'] = $ticketData['footer']['extraFields']['tourCode'] || null;
			$ticket['originalIssue'] = $ticketData['footer']['extraFields']['originalIssue'] || null;
			$ticket['exchangedFor'] = $ticketData['footer']['extraFields']['exchangedFor'] || null;
			$ticket['endorsementLines'] = $ticketData['footer']['endorsementLines'] || null;
			$ticket['segments'] = Fp.map(($segment) => {
				return this.transformTicketSegment($segment, $reservationDate);
			}, $ticketData['segments']);

			return $ticket;
		} else {
			return $ticketData;
		}
	}

	// ======================
	//  3-rd level
	// ======================

	static transformTicketSegment($segmentData, $reservationDate)  {
		let $segment, $fullDate, $time;
		$segment = {};
		$fullDate = DateTime.decodeRelativeDateInFuture($segmentData['departureDate']['parsed'], $reservationDate);
		if ($time = $segmentData['departureTime']['parsed'] || null) {
			$fullDate += ' '+$time+':00';
		}
		$segment['couponNumber'] = $segmentData['couponNumber'];
		$segment['couponStatus'] = $segmentData['couponStatus'];
		$segment['airline'] = $segmentData['airline'];
		$segment['flightNumber'] = $segmentData['flightNumber'];
		$segment['bookingClass'] = $segmentData['bookingClass'];
		$segment['departureDate'] = {
			'raw': $segmentData['departureDate']['raw'],
			'parsed': $segmentData['departureDate']['parsed'],
			'full': $fullDate,
		};
		$segment['departureAirport'] = $segmentData['departureAirport'];
		$segment['destinationAirport'] = $segmentData['destinationAirport'];
		$segment['departureTime'] = $segmentData['departureTime'];
		$segment['bookingStatus'] = $segmentData['bookingStatus'];
		$segment['fareBasis'] = $segmentData['fareBasis'];
		$segment['ticketDesignator'] = $segmentData['ticketDesignator'] || null;
		$segment['segmentType'] = 'SEGMENT_TYPE_ITINERARY_SEGMENT';
		return $segment;
	}
}
module.exports = ImportApolloPnrFormatAdapter;
