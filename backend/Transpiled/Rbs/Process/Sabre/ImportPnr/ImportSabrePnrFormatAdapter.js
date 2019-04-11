// namespace Rbs\Process\Sabre\ImportPnr;
const ArrayUtil = require('../../../../Lib/Utils/ArrayUtil.js');
const DateTime = require('../../../../Lib/Utils/DateTime.js');
const Fp = require('../../../../Lib/Utils/Fp.js');
const FormatAdapter = require('../../../../Rbs/IqControllers/FormatAdapter.js');
const ItineraryParser = require('../../../../Gds/Parsers/Sabre/Pnr/PnrParser.js');
const ImportPnrAction = require('../../../../Rbs/Process/Common/ImportPnr/ImportPnrAction.js');
const ImportPnrCommonFormatAdapter = require('../../../../Rbs/Process/Common/ImportPnr/ImportPnrCommonFormatAdapter.js');
const PtcUtil = require('../../../../Rbs/Process/Common/PtcUtil.js');
const php = require('../../../../php.js');
const FareRuleOrSegmentsParser = require('../../../../Gds/Parsers/Sabre/FareRuleOrSegmentsParser.js');

/**
 * transforms output of the ImportSabrePnrAction to a common for any GDS structure
 */
class ImportSabrePnrFormatAdapter {
	// =====================
	//  1-st level
	// =====================

	/** @param $parsedData = SabreReservationParser::parse() */
	static transformReservation($parsedData, $creationDate) {
		let $nameRecords, $reservation, $pnrInfo, $baseDate;

		if (php.isset($parsedData['error'])) {
			return $parsedData;
		}

		$nameRecords = ((($parsedData['parsedData'] || {})['passengers'] || {})['parsedData'] || {})['passengerList'] || [];
		$reservation = {};

		$pnrInfo = php.isset($parsedData['parsedData']['pnrInfo']) ? this.transformPnrInfo($parsedData['parsedData']['pnrInfo']) : null;
		$baseDate = ($pnrInfo['reservationDate'] || {})['full'] || $creationDate;
		$reservation['pnrInfo'] = $pnrInfo;
		$reservation['passengers'] = $nameRecords;
		$reservation['itinerary'] = FormatAdapter.adaptSabreItineraryParseForClient(($parsedData['parsedData'] || {})['itinerary'] || [], $baseDate);

		// commenting til we really need these fields

//        $reservation['phones'] = Fp::map(function($phone) {
//            return [
//                'lineNumber' => $phone['lineNumber'],
//                'raw' => $phone['raw'],
//                'parsed' => isset($phone['parsed']) ? [
//                    'city' => $phone['parsed']['city'],
//                    'phoneNumber' => $phone['parsed']['phoneNumber'],
//                    'phoneTypeToken' => $phone['parsed']['phoneTypeToken'] ?? null,
//                ] : null,
//            ];
//        }, $parsedData['parsedData']['phones'] ?? []);

		$reservation['remarks'] = FormatAdapter.transformSabreRemarks(($parsedData['parsedData'] || {})['remarks'] || []);
		$reservation['confirmationNumbers'] = ImportPnrCommonFormatAdapter.collectConfirmationNumbers(($parsedData['parsedData'] || {})['itinerary'] || []);

		$reservation['dataExistsInfo'] = {
			'mileageProgramsExist': $parsedData['parsedData']['misc']['ffDataExists'],
			'fareQuoteExists': $parsedData['parsedData']['misc']['priceQuoteRecordExists'],
			'dividedBookingExists': php.in_array('DIVIDED_REMARK', php.array_column(($parsedData['parsedData'] || {})['remarks'] || [], 'remarkType')),
			'isInvoicedExists': $parsedData['parsedData']['misc']['isInvoiced'],
			'formOfPaymentExists': $parsedData['parsedData']['misc']['fopDataExists'],
			'passengerEmailDataExists': $parsedData['parsedData']['misc']['passengerEmailDataExists'],
			'pctcDataExists': $parsedData['parsedData']['misc']['pctcDataExists'],
			'pqfDataExists': $parsedData['parsedData']['misc']['pqfDataExists'],
			'securityInfoExists': $parsedData['parsedData']['misc']['securityInfoExists'],
		};

		$reservation['dumpNumbers'] = $parsedData['dumpNumbers'];
		$reservation = ImportPnrCommonFormatAdapter.addContextDataToPaxes($reservation);
		return $reservation;
	}

	static transformFormOfPaymentInfo($parsedData) {

		// TODO: transform!
		return $parsedData;
	}

	static fillHiddenStopLeg($firstLeg, $hiddenStopLeg) {
		let $clean;

		$clean = php.array_filter($hiddenStopLeg);
		$hiddenStopLeg['departureDate'] = $clean['departureDate'] || $firstLeg['departureDate'];
		$hiddenStopLeg['aircraft'] = $clean['aircraft'] || $firstLeg['aircraft'];

		return $hiddenStopLeg;
	}

	/** @param $parsedData = SabreVerifyParser::parse() */
	static transformFlightServiceInfo($parsedData, $baseDate) {

		return !php.isset($parsedData['error']) ? {
			'segments': Fp.map(($segment) => {
				let $firstLeg;

				$firstLeg = ArrayUtil.getFirst($segment['legs']);
				return {
					'segmentNumber': $segment['segmentNumber'],
					'airline': $segment['airline'],
					'flightNumber': $segment['flightNumber'],
					'legs': Fp.map(($legData) => {

						$legData = this.fillHiddenStopLeg($firstLeg, $legData);
						return this.transformFlightServiceInfoLeg($legData, $baseDate);
					}, $segment['legs']),
				};
			}, $parsedData['segments']),
			'dumpNumbers': $parsedData['dumpNumbers'],
		} : $parsedData;
	}

	static transformFlightServiceInfoLeg($legData, $baseDate) {
		let $leg, $fullDepartureDate, $fullDestinationDate;

		$leg = {};

		$leg['departureTerminal'] = php.isset($legData['departureTerminal']['raw']) ? {
			'raw': $legData['departureTerminal']['raw'],
			'parsed': $legData['departureTerminal']['parsed'],
		} : null;
		$leg['destinationTerminal'] = php.isset($legData['destinationTerminal']['raw']) ? {
			'raw': $legData['destinationTerminal']['raw'],
			'parsed': $legData['destinationTerminal']['parsed'],
		} : null;

		$leg['departureAirport'] = $legData['departureAirport'];
		$leg['destinationAirport'] = $legData['destinationAirport'];
		$leg['meals'] = {
			'raw': $legData['meals']['raw'],
			'parsed': $legData['meals']['parsed'],
		};
		$leg['smoking'] = $legData['smoking'];
		$leg['aircraft'] = $legData['aircraft'];
		$leg['flightDuration'] = $legData['flightDuration'];
		$leg['miles'] = $legData['miles'];

		$fullDepartureDate = php.isset($legData['departureDate']['parsed'])
			? DateTime.decodeRelativeDateInFuture($legData['departureDate']['parsed'], $baseDate)
			: null;
		$fullDestinationDate = $fullDepartureDate
			? php.date('Y-m-d', php.strtotime(' +' + $legData['offset'] + ' day', php.strtotime($fullDepartureDate)))
			: null;

		$leg['departureDt'] = {
//            'raw' => $legData['departureDate']['raw'].' '.$legData['departureTime']['raw'],
			'parsed': $legData['departureDate']['parsed'] + ' ' + $legData['departureTime']['parsed'],
			'full': $fullDepartureDate
				? $fullDepartureDate + ' ' + $legData['departureTime']['parsed'] + ':00'
				: null,
		};
		$leg['destinationDt'] = {
//            'raw' => $legData['departureDate']['raw'].' '.'+ '.$legData['offset'].' '.$legData['destinationTime']['raw'],
			'parsed': php.date('m-d', php.strtotime($fullDestinationDate)) + ' ' + $legData['destinationTime']['parsed'],
			'full': $fullDestinationDate
				? $fullDestinationDate + ' ' + $legData['destinationTime']['parsed'] + ':00'
				: null,
		};

		return $leg;
	}

	static addRequestedPtc($ptcBlocks, $mods) {
		let $modPtcs, $cmdPtcs, $i;

		$mods = php.array_combine(php.array_column($mods, 'type'), php.array_column($mods, 'parsed'));

		if ($modPtcs = $mods['ptc']) {
			// Sabre automatically groups repeating PTC-s from command
			$cmdPtcs = php.array_keys(Fp.groupBy(($rec) => {
				return $rec['ptc'];
			}, $modPtcs));
			for ($i = 0; $i < php.count($ptcBlocks); ++$i) {
				$ptcBlocks[$i]['ptcInfo']['ptcRequested'] = $cmdPtcs[$i];
				$ptcBlocks[$i]['ptcInfo']['ageGroupRequested'] = PtcUtil.parsePtc($cmdPtcs[$i])['ageGroup'];
			}
		} else {
			for ($i = 0; $i < php.count($ptcBlocks); ++$i) {
				$ptcBlocks[$i]['ptcInfo']['ptcRequested'] = null;
				$ptcBlocks[$i]['ptcInfo']['ageGroupRequested'] = null;
			}
		}

		return $ptcBlocks;
	}

	static transformTicketInfo($parsedData, $reservationDate) {

		return !php.isset($parsedData['error']) ? {
			'tickets': Fp.map(($ticket) => {

				return this.transformTicket($ticket, $reservationDate);
			}, $parsedData['tickets']),
			'dumpNumbers': $parsedData['dumpNumbers'],
		} : $parsedData;
	}

	/** @param $ticketData = SabreTicketParser::parse() */
	static transformTicket($ticketData, $reservationDate) {
		let $ticket;

		$ticket = {};

		$ticket['error'] = $ticketData['error'];
		$ticket['errorType'] = $ticketData['errorType'];
		$ticket['ticketNumber'] = ($ticketData['header'] || {})['ticketNumber'];
		$ticket['ticketNumberExtension'] = ($ticketData['header'] || {})['ticketNumberExtension'];
		$ticket['dumpNumber'] = $ticketData['dumpNumber'];
		$ticket['passengerName'] = ($ticketData['header'] || {})['passengerName'];
		$ticket['issueDate'] = php.isset($ticketData['header']['issueDate']) ? {
			'raw': $ticketData['header']['issueDate']['raw'],
			'parsed': $ticketData['header']['issueDate']['parsed'],
			'full': $ticketData['header']['issueDate']['parsed'],
		} : null;
		$ticket['pcc'] = ($ticketData['header'] || {})['pcc'];
		$ticket['tourCode'] = ($ticketData['header'] || {})['tourId'];
		$ticket['originalIssue'] = ($ticketData['extraFields'] || {})['originalIssue'];
		$ticket['exchangedFor'] = ($ticketData['extraFields'] || {})['exchangedFor'];
		$ticket['endorsementLines'] = $ticketData['endorsementLines'];
		$ticket['segments'] = Fp.map(($segment) => {

			return this.transformTicketSegment($segment, $reservationDate);
		}, $ticketData['segments'] || []);

		return $ticket;
	}

	static transformTicketingAgentInfo($ticketListInfo, $reservationDate) {
		let $ticketingDate;

		if ($ticketingDate = ($ticketListInfo['ticketingInfo'] || {})['ticketingDate']) {
			$ticketingDate['full'] = DateTime.decodeRelativeDateInFuture($ticketingDate['parsed'], $reservationDate);
		}

		return !php.isset($ticketListInfo['error']) ? {
			'agentInitials': ($ticketListInfo['ticketingInfo'] || {})['agentInitials'],
			'ticketingDate': $ticketingDate,
			'agencyInfo': php.isset($ticketListInfo['ticketingInfo']['pcc']) ? {
				'pcc': $ticketListInfo['ticketingInfo']['pcc'],
			} : null,
			'dumpNumbers': $ticketListInfo['dumpNumbers'],
		} : $ticketListInfo;
	}

	/**
	 * @param array $ticketList = SabreTicketListParser::parse()
	 * @param array $history = ImportSabrePnrFormatAdapter::transformPnrHistory()
	 */
	static transformTicketInvoiceInfo($ticketList, $history, $reservationDt) {
		let $records, $error, $getNum, $numToTrans, $rcvdRecord, $actRecord, $parsed, $ticketNum, $trans, $isVoided,
			$ticket;

		$records = [];
		if (!($error = $ticketList['error'] || $history['error'])) {
			$getNum = ($ticket) => php.substr($ticket['ticketNumber'], 3);
			$numToTrans = Fp.groupBy($getNum, $ticketList['tickets']);

			for ($rcvdRecord of Object.values($history['rcvdList'])) {
				for ($actRecord of Object.values($rcvdRecord['actions'])) {
					if ($actRecord['code']['parsed'] === 'addedAccountingLineField') {
						$parsed = $actRecord['content']['parsed'];
						$ticketNum = $parsed['partialTicketNumber'];
						if ($trans = $numToTrans[$ticketNum]) {
							$isVoided = php.count($trans) > 1;
							$ticket = php.array_shift($trans);
							$records.push({
								'ticketNumber': $ticket['ticketNumber'],
								'invoiceNumber': $parsed['invoiceNumber'],
								'netPrice': {
									'currency': null, // should we determine it from PCC?
									'amount': php.sprintf('%.02f', $parsed['baseAmount'] + $parsed['taxAmount']),
								},
								'dt': this.makeFutureDate($reservationDt, $ticket['issueDate'], $ticket['issueTime']),
								'isVoided': $isVoided,
							});
						} else {
							$error = 'Got a ticket in history that actually does not exist - ' + $ticketNum;
							break;
						}
					}
				}
			}
		}
		return {
			'records': $records,
			'error': $error,
			'dumpNumbers': php.array_merge($ticketList['dumpNumbers'] || [], $history['dumpNumbers'] || []),
		};
	}

	static transformSeatInfo($parsedData, $passengers) {
		let $error, $seats, $segmentNumber, $seatDataList, $seatData, $seat;

		if ($error = $parsedData['error']) {
			return $parsedData;
		} else {
			$seats = [];

			for ([$segmentNumber, $seatDataList] of Object.entries($parsedData['seatsBySegment'])) {
				for ($seatData of Object.values($seatDataList)) {
					$seat = {};
					$seat['segmentNumber'] = $segmentNumber;
					$seat['passengerNameNumber'] = this.transformNameNumber($seatData['passengerNumber'], $passengers);
					$seat['passengerName'] = $seatData['passengerName'];
					$seat['requestStatus'] = $seatData['requestStatus'];
					$seat['seatCode'] = $seatData['seatCode'];
					$seat['zone'] = $seatData['zone']['raw'];
					$seat['location'] = $seatData['location']['raw'];
					$seats.push($seat);
				}
			}

			return {'seats': $seats, 'dumpNumbers': $parsedData['dumpNumbers']};
		}
	}

	static transformFrequentFlyerInfo($parsedData, $passengers) {

		return {
			'mileagePrograms': Fp.map(($mp) => {

				return this.transformMileageProgram($mp, $passengers);
			}, $parsedData['mileagePrograms'] || []),
			'dumpNumbers': $parsedData['dumpNumbers'],
		};
	}

	static transformMileageProgram($mileageProgramEl, $passengers) {
		let $program;

		$program = {};

		$program['airline'] = $mileageProgramEl['airline'];
		$program['code'] = $mileageProgramEl['code'];
		$program['passengerNameNumber'] = this.transformNameNumber($mileageProgramEl['passengerNumber'], $passengers);
		$program['passengerName'] = $mileageProgramEl['passengerName'];
		$program['status'] = $mileageProgramEl['status'];
		$program['operatingAirline'] = $mileageProgramEl['operatingAirline'];
		$program['remark'] = $mileageProgramEl['remark'];
		$program['segment'] = php.isset($mileageProgramEl['segment']) ? {
			'airline': $mileageProgramEl['segment']['airline'],
			'flightNumber': $mileageProgramEl['segment']['flightNumber'],
			'bookingClass': $mileageProgramEl['segment']['bookingClass'],
			'departureDate': {
				'raw': $mileageProgramEl['segment']['departureDate']['raw'],
				'parsed': $mileageProgramEl['segment']['departureDate']['parsed'],
			},
			'departureAirport': $mileageProgramEl['segment']['departureAirport'],
			'destinationAirport': $mileageProgramEl['segment']['destinationAirport'],
		} : null;

		return $program;
	}

	/**
	 * @param $parsedData = SabrePnrHistoryParser::parse()
	 */
	static transformPnrHistory($parsedData) {
		let $common;

		$common = {
			'rcvdList': Fp.map(($rcvdRecord) => {
				let $rcvd;

				$rcvd = $rcvdRecord['rcvd'];
				$rcvd['receivedDt']['full'] = $rcvd['receivedDt']['date'] + ' ' + $rcvd['receivedDt']['time'] + ':00';
				$rcvd['pcc'] = ($rcvd['originData'] || {})['pcc'];
				$rcvd['airline'] = ($rcvd['originData'] || {})['airline'];
				delete ($rcvd['originData']['pcc'], $rcvd['originData']['airline']);

				return {
					'rcvd': $rcvd,
					'actions': $rcvdRecord['actions'],
				};
			}, $parsedData['rcvdList']),
		};
		return $common;
	}

	static transformRepeatedItineraryInfo($parsedData, $baseDate) {

		return !php.isset($parsedData['error']) ? {
			'dumpNumber': $parsedData['dumpNumber'],
			'isSameAsOriginal': $parsedData['isSameAsOriginal'],
			'isReadyToSell': $parsedData['isReadyToSell'],
			'itinerary': FormatAdapter.adaptSabreItineraryParseForClient($parsedData['itinerary'] || [], $baseDate),
			'dumpNumbers': $parsedData['dumpNumbers'],
		} : $parsedData;
	}

	static findPaxMatchingNumber($flatPassengers, $ssrPaxNum) {
		let $pax, $paxNum;

		for ($pax of Object.values($flatPassengers)) {
			$paxNum = $pax['nameNumber']['fieldNumber'] + '.' + $pax['nameNumber']['firstNameNumber'];
			if ($paxNum === $ssrPaxNum) {
				return $pax;
			}
		}
		return null;
	}

	/**
	 * @param array $docSsrList = ImportPnrCommonFormatAdapter::transformSsrList()
	 * @param array $flatPassengers = ImportPnrCommonFormatAdapter::flattenPassengers()
	 */
	static addNameNumberToSsrs($docSsrList, $flatPassengers) {
		let $i, $paxNum, $pax;

		for ($i = 0; $i < php.count($docSsrList); ++$i) {
			$paxNum = (($docSsrList[$i] || {})['data'] || {})['paxNum'];
			if ($paxNum !== null) {
				$pax = this.findPaxMatchingNumber($flatPassengers, $paxNum);
			} else if (php.count($flatPassengers) === 1) {
				$pax = $flatPassengers[0];
			} else {
				$pax = null;
			}
			if (php.isset($docSsrList[$i]['data'])) {
				$docSsrList[$i]['data']['passengerNameNumber'] = $pax ? $pax['nameNumber'] : null;
			}
			delete ($docSsrList[$i]['data']['paxNum']);
			delete ($docSsrList[$i]['data']['paxName']);
		}
		return $docSsrList;
	}

	static pqToRSegments($pqSegments) {
		let $rSegments, $segmentNumber, $i;

		$rSegments = [];
		$segmentNumber = 1;

		// transforming them to be like *R segments
		for ($i = 0; $i < php.count($pqSegments) - 1; ++$i) {
			if ($pqSegments[$i]['type'] !== 'void') {
				$rSegments.push({
					'segmentNumber': $segmentNumber++,
					'airline': $pqSegments[$i]['airline'],
					'departureAirport': $pqSegments[$i]['airport'],
					'destinationAirport': $pqSegments[$i + 1]['airport'],
					'fareBasis': $pqSegments[$i]['fareBasis'],
					'ticketDesignator': $pqSegments[$i]['ticketDesignator'],
				});
			}
		}
		return $rSegments;
	}

	static collectFcFares($fareConstruction, $pqSegments, $geo) {
		let $rSegments, $record, $result, $destinations, $i, $chunkSize, $chunk;

		if (php.isset($fareConstruction['error'])) {
			return null;
		}

		$rSegments = this.pqToRSegments($pqSegments);

		$record = ImportPnrAction.collectPricedDestinations($fareConstruction['data']['segments'], $rSegments, $geo);
		if (php.isset($record['error'])) {
			return null;
		} else {
			$result = [];
			$destinations = $record['segmentNumbers'];
			for ($i = 0; $i < php.count($destinations); ++$i) {
				$chunkSize = $destinations[$i] - ($destinations[$i - 1] || 0);
				$chunk = php.array_slice($rSegments, ($destinations[$i - 1] || 0), $chunkSize);
				$result.push({
					'componentNumber': $i + 1,
					'segmentNumbers': php.array_column($chunk, 'segmentNumber'),
					'departureAirport': ($chunk[0] || {})['departureAirport'],
					'destinationAirport': ($chunk[php.count($chunk) - 1] || {})['destinationAirport'],
					'fareBasis': php.isset($chunk[0]['fareBasis'])
						? php.explode('\/', $chunk[0]['fareBasis'])[0]
						: null,
				});
			}
			return $result;
		}
	}

	static addFareBasesToFc($fareConstruction, $pqSegments) {
		let $rSegments, $fcSegments, $key, $fareSegment;

		$rSegments = this.pqToRSegments($pqSegments);
		$fcSegments = $fareConstruction['segments'];

		if (php.count($rSegments) == php.count($fcSegments)) {
			for ([$key, $fareSegment] of Object.entries($fcSegments)) {
				if (php.isset($fareSegment['fare'])) {
					$fcSegments[$key]['fareBasis'] = $rSegments[$key]['fareBasis'];
					$fcSegments[$key]['ticketDesignator'] = $rSegments[$key]['ticketDesignator'];
				}
			}
			$fareConstruction['segments'] = $fcSegments;
		}

		return $fareConstruction;
	}

	/**
	 * >*PQ has segment => fare basis mapping, which
	 * contains stopover flag from fare construction,
	 * but occasionally (maybe Sabre fails to parse Fare Construction?)
	 * all segments are marked as stopovers,
	 * so this can be used only as a fallback
	 */
	static collectPqFares($pqSegments) {
		let $fareList, $rSegNums, $departureAirport, $fareBasis, $destinationAirport, $componentNumber, $segmentNumber,
			$i, $pqSeg, $next;

		$fareList = [];
		$rSegNums = [];
		$departureAirport = null;
		$fareBasis = null;
		$destinationAirport = null;
		$componentNumber = 0;
		$segmentNumber = 1;
		for ($i = 0; $i < php.count($pqSegments) - 1; ++$i) {
			$pqSeg = $pqSegments[$i];
			$next = $pqSegments[$i + 1];
			$departureAirport = $departureAirport || $pqSeg['airport'];
			$fareBasis = $fareBasis || $pqSeg['fareBasis'];

			if ($pqSeg['type'] !== 'void') {
				$rSegNums.push($segmentNumber++);
			} else {
				$destinationAirport = $pqSeg['airport'];
			}

			if (!php.empty($next['isStopover']) || $next['type'] === 'lastAirport') {
				$fareList.push({
					'componentNumber': ++$componentNumber,
					'segmentNumbers': php.array_splice($rSegNums, 0),
					'departureAirport': $departureAirport,
					'destinationAirport': $destinationAirport || $next['airport'],
					'fareBasis': (php.explode('\/', $fareBasis) || {})[0],
				});
				$fareBasis = null;
				$departureAirport = null;
			}
			$destinationAirport = null;
		}

		return $fareList;
	}

	/**
	 * @param $priceQuoteInfo array - output of the
	 * @see PqParser::parse()
	 */
	static transformFareListFromPq($priceQuoteInfo, $geo) {
		let $fareListRecords, $pricing, $fares;

		if (php.isset($priceQuoteInfo['error'])) {
			return $priceQuoteInfo;
		}
		$fareListRecords = [];
		for ($pricing of Object.values($priceQuoteInfo['pqList'] || [])) {
			$fares = this.collectFcFares($pricing['priceInfo']['fareConstruction'],
				$pricing['priceInfo']['segments'], $geo) || this.collectPqFares($pricing['priceInfo']['segments']);
			$fareListRecords.push({
				'pricingNumber': $pricing['pqNumber'],
				'subPricingNumber': 1,
				'dumpNumber': ($priceQuoteInfo['dumpNumbers'] || {})[$pricing['pqNumber'] - 1],
				'fareList': $fares,
			});
		}

		return {
			'data': $fareListRecords,
			'dumpNumbers': $priceQuoteInfo['dumpNumbers'] || [],
		};
	}

	static collectWprdFares($wprdSegments, $pricing) {
		let $error, $fcSegments, $fareList, $segNumChunk, $fareNum, $departureAirport, $i, $wprdSeg, $fcSeg;

		[$error, $fcSegments] = ImportPnrAction.getLfSegments([$pricing]);
		if ($error) return {'error': $error};
		if (!$fcSegments) return {'error': 'Empty fare construction'};
		if (php.count($fcSegments) !== php.count($wprdSegments)) {
			$error = 'Count of WPRD* segments ' + php.count($wprdSegments)
				+ ' does not match FC segments - ' + php.count($fcSegments);
			return {'error': $error};
		}

		$fareList = [];
		$segNumChunk = [];
		$fareNum = 1;
		$departureAirport = null;
		for ($i = 0; $i < php.count($wprdSegments); ++$i) {
			$wprdSeg = $wprdSegments[$i];
			$fcSeg = $fcSegments[$i];
			$departureAirport = $departureAirport || $wprdSeg['departureAirport'];
			$segNumChunk.push($wprdSeg['segmentNumber']);
			if ($fcSeg['fare'] || false) {
				$fareList.push({
					'componentNumber': $fareNum++,
					'segmentNumbers': $segNumChunk,
					'fareBasis': $wprdSeg['fareBasis'],
					'departureAirport': $departureAirport,
					'destinationAirport': $wprdSeg['destinationAirport'],
				});
				$segNumChunk = [];
				$departureAirport = null;
			}
		}

		return {'data': $fareList};
	}

	/**
	 * @param array $wprdRecord = FareRuleOrSegmentsParser::parse()
	 * @param array $pricing = static::transformPublishedPricing()['pricingBlockList'][0]
	 * @param array $rSegments = ItineraryParser::parse()
	 */
	static transformFareListFromWprd($wprdRecord, $pricing, $rSegments) {
		let $error, $dumpNumbers, $ruleRecords, $fareRules, $wprdSegments, $fareListRecord;

		$error = $wprdRecord['error'] || $pricing['error'];
		if ($error) return {'error': $error};

		$dumpNumbers = [];
		$ruleRecords = [];
		if ($wprdRecord['type'] === FareRuleOrSegmentsParser.SINGLE_RULE) {
			$fareRules = $wprdRecord['data'];
			$wprdSegments = Fp.map(($rSeg) => {

				return php.array_merge($rSeg, $fareRules['fareComponent'], $fareRules['header']);
			}, $rSegments);
			$ruleRecords.push({
				'componentNumber': 1,
				'dumpNumber': $wprdRecord['dumpNumber'],
				'sections': $fareRules['sections'],
				'fareComponent': $fareRules['fareComponent'],
			});
		} else {
			$dumpNumbers.push($wprdRecord['dumpNumber']);
			$wprdSegments = $wprdRecord['data'];
		}
		$fareListRecord = this.collectWprdFares($wprdSegments, $pricing);
		if ($error = $fareListRecord['error']) {
			return {'error': $error};
		}

		return {
			'fareList': $fareListRecord['data'],
			'ruleRecords': $ruleRecords,
			'dumpNumbers': $dumpNumbers,
		};
	}

	// ======================
	//  2-nd level
	// =======================

	static transformPnrInfo($pnrInfoData) {
		let $parsedDate;

		$parsedDate = ($pnrInfoData['date'] || {})['parsed'];

		return {
			'recordLocator': $pnrInfoData['recordLocator'],
			'agentInitials': $pnrInfoData['agentInitials'],
			'receivedFrom': $pnrInfoData['receivedFrom'],
			'reservationDate': {
				'raw': $pnrInfoData['date']['raw'],
				'parsed': $parsedDate,
				'full': $parsedDate + ' ' + $pnrInfoData['time']['parsed'] + ':00',
			},
			'agencyInfo': {
				'pcc': $pnrInfoData['pcc'],
				'homePcc': $pnrInfoData['homePcc'],
			},
		};
	}

	static transformTicketSegment($segmentData, $reservationDate) {
		let $segment, $fullDate, $time;

		$segment = {};

		$segment['segmentType'] = $segmentData['segmentType'];
		if ($segment['segmentType'] === ItineraryParser.SEGMENT_TYPE_ITINERARY_SEGMENT) {

			$fullDate = DateTime.decodeRelativeDateInFuture($segmentData['departureDate']['parsed'], $reservationDate);
			if ($time = ($segmentData['departureTime'] || {})['parsed']) {
				$fullDate += ' ' + $time + ':00';
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
			$segment['ticketDesignator'] = $segmentData['ticketDesignator'];
		}

		return $segment;
	}

	// ======================
	//  3-rd level
	// =======================

	static transformFareInfo($fareInfo, $pqInfo) {
		let $result, $fc;

		$result = {};
		$result['baseFare'] = {
			'currency': $fareInfo['totals']['baseFare']['currency'],
			'amount': $fareInfo['totals']['baseFare']['amount'],
		};
		$result['fareEquivalent'] = php.isset($fareInfo['totals']['inDefaultCurrency']) ? {
			'currency': $fareInfo['totals']['inDefaultCurrency']['currency'],
			'amount': $fareInfo['totals']['inDefaultCurrency']['amount'],
		} : null;
		$result['totalFare'] = {
			'currency': $fareInfo['totals']['total']['currency'],
			'amount': $fareInfo['totals']['total']['amount'],
		};
		$result['taxList'] = Fp.map(($tax) => {

			return {
				'taxCode': $tax['taxCode'],
				'amount': $tax['amount'],
			};
		}, $fareInfo['taxList']);

		if ($fc = ($pqInfo['fareConstruction'] || {})['data']) {
			if (!php.empty($pqInfo['segments'])) { // pricing would not have PQ segments
				$fc = this.addFareBasesToFc($fc, $pqInfo['segments']);
			}
		} else {
			$fc = {
				'error': ($pqInfo['fareConstruction'] || {})['error'] || 'failed to parse fare construction',
			};
		}
		$result['fareConstruction'] = $fc;

		return $result;
	}

	static transformBaggageInfo($baggageData, $ptc) {

		return {
			'baggageAllowanceBlocks': [
				{
					'ptc': $ptc,
					'segments': php.array_map(
						seg => this.transformBagAllowanceSegment(seg),
						$baggageData['baggageAllowanceBlock']['segments']
					),
				},
			],
			'carryOnAllowanceBlock': {
				'segments': Fp.flatten(Fp.map(($carryOnInfo) => {
					let $segments, $cityPair;

					$segments = [];
					for ($cityPair of Object.values(($carryOnInfo['bundle'] || {})['cityPairs'] || [])) {
						$segments.push({
							'segmentDetails': {
								'airline': $carryOnInfo['bundle']['airline'],
								'departureAirport': $cityPair['departureAirport'],
								'destinationAirport': $cityPair['destinationAirport'],
								'bagWithoutFeeNumber': php.isset($carryOnInfo['bundle']['amount'])
									? $carryOnInfo['bundle']['amount']['amount'] + $carryOnInfo['bundle']['amount']['unitsCode']
									: null,
								'bagWithoutFeeNumberParsed': ($carryOnInfo['bundle'] || {})['amount'],
								'isAvailable': $carryOnInfo['bundle']['isAvailable'],
								'error': ($carryOnInfo['bundle'] || {})['error'],
							},
							'bags': php.array_map(($piece, $i) => {

								return {
									'flags': [],
									'bagNumber': $i + 1,
									'weightInLb': ($piece['data'] || {})['weightInLb'],
									'weightInKg': ($piece['data'] || {})['weightInKg'],
									'sizeInInches': ($piece['data'] || {})['sizeInInches'],
									'sizeInCm': ($piece['data'] || {})['sizeInCm'],
									'pieceType': $piece['pieceType'],
									// a'm not very sure. there is this "carryOnChargesBlock" which almost always
									// says "CARRY ON FEES UNKNOWN-CONTACT CARRIER" and i have not enough dumps to parse it ok
									'feeAmount': null,
									'feeCurrency': null,
									'bagDescription': $piece['text'],
								};
							}, $carryOnInfo['pieces'], php.array_keys($carryOnInfo['pieces'])),
						});
					}

					return $segments;
				}, $baggageData['carryOnAllowanceBlock']))
			},
			'misc': {
				'additionalInfo': $baggageData['additionalInfo'],
			},
		};
	}

	// =======================
	//  4-th level
	// ======================

	static transformBagAllowanceSegment($segment) {

		return {
			'segmentDetails': {
				'airline': $segment['free']['airline'],
				'departureAirport': $segment['free']['departureStopover'],
				'destinationAirport': $segment['free']['destinationStopover'],
				'bagWithoutFeeNumber': php.isset($segment['free']['amount'])
					? $segment['free']['amount']['amount'] + $segment['free']['amount']['unitsCode']
					: null,
				'bagWithoutFeeNumberParsed': ($segment['free'] || {})['amount'],
				'isAvailable': php.isset($segment['free']['amount']['unitsCode']),
				'error': null,
			},
			'bags': php.array_merge($segment['free']['amount']['units'] === 'pieces'
				? Fp.map(($i) => {

					return {
						'flags': ['noFeeFlag'],
						'bagNumber': $i + 1,
						'bagDescription': ($segment['free'] || {})['sizeInfoRaw'],
						'weightInLb': (($segment['free'] || {})['sizeInfo'] || {})['weightInLb'],
						'weightInKg': (($segment['free'] || {})['sizeInfo'] || {})['weightInKg'],
						'sizeInInches': (($segment['free'] || {})['sizeInfo'] || {})['sizeInInches'],
						'sizeInCm': (($segment['free'] || {})['sizeInfo'] || {})['sizeInCm'],
						'feeAmount': null,
						'feeCurrency': null,
					};
				}, +$segment['free']['amount']['amount'] > 0
					? php.range(0, $segment['free']['amount']['amount'] - 1)
					: [])
				: ($segment['free']['amount']['units'] !== null
						? [{
							'flags': ['noFeeFlag'],
							'bagNumber': 1,
							'bagDescription': ($segment['free'] || {})['sizeInfoRaw'],
							'weightInLb': (($segment['free'] || {})['sizeInfo'] || {})['weightInLb'],
							'weightInKg': (($segment['free'] || {})['sizeInfo'] || {})['weightInKg'],
							'sizeInInches': (($segment['free'] || {})['sizeInfo'] || {})['sizeInInches'],
							'sizeInCm': (($segment['free'] || {})['sizeInfo'] || {})['sizeInCm'],
							'feeAmount': null,
							'feeCurrency': null,
						}] : []
				),
				Fp.map(($fee) => {

					return {
						'flags': [],
						'bagNumber': $fee['feeNumber'],
						'bagDescription': $fee['sizeInfoRaw'],
						'weightInLb': ($fee['sizeInfo'] || {})['weightInLb'],
						'weightInKg': ($fee['sizeInfo'] || {})['weightInKg'],
						'sizeInInches': ($fee['sizeInfo'] || {})['sizeInInches'],
						'sizeInCm': ($fee['sizeInfo'] || {})['sizeInCm'],
						'feeAmount': $fee['amount'],
						'feeCurrency': $fee['currency'],
					};
				}, $segment['fees'])),
		};
	}

	static transformNameNumber($rawPaxNumber, $passengers) {
		let $allNameNumbers, $matches, $_, $fieldNumber, $firstNameNumber;

		$allNameNumbers = php.array_column($passengers, 'nameNumber');

		if (php.preg_match(/^\s*(\d+)\.(\d+)\s*$/, $rawPaxNumber, $matches = [])) {
			[$_, $fieldNumber, $firstNameNumber] = $matches;

			return ArrayUtil.getFirst(Fp.filter(($nameNumber) => {

				return $nameNumber['fieldNumber'] == $fieldNumber
					&& $nameNumber['firstNameNumber'] == $firstNameNumber;
			}, $allNameNumbers));
		} else {
			return null;
		}
	}

	static makeFutureDate($baseDt, $dateRecord, $timeRecord) {
		let $full, $tm;

		$full = DateTime.decodeRelativeDateInFuture($dateRecord['parsed'], $baseDt);
		if ($full && $timeRecord) {
			$tm = $timeRecord['parsed'];
			$full = $tm ? $full + ' ' + $tm + ':00' : null;
		}
		return {
			'raw': $dateRecord['raw'] + ' ' + $timeRecord['raw'],
			'parsed': $dateRecord['parsed'] + ' ' + $timeRecord['parsed'],
			'full': $full,
		};
	}
}

module.exports = ImportSabrePnrFormatAdapter;
