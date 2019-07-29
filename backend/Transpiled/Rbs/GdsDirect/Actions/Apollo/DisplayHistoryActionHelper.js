
const StringUtil = require('../../../../Lib/Utils/StringUtil.js');

let php = require('../../../../phpDeprecated.js');

class DisplayHistoryActionHelper {
	static getStatusLabel($status) {
		let $labels;
		$labels = {
			'addedSegment': 'ADDED SEGMENT',
			'statusChange': 'STATUS CHANGE',
			'cancelledSegment': 'CANCELLED SEGMENT',
			'originalHistoricalSegments': 'ORIGINAL HISTORICAL SEGMENTS',
			'addedConfirmationNumber': 'ADDED CONFIRMATION NUMBER',
			'linkConfirmed': 'LINK CONFIRMED',
			'marriageLogicBroken': 'MARRIAGE LOGIC BROKEN',
			'seatIsSavedOrRequested': 'SEAT IS SAVED OR REQUESTED',
			'seatCancelled': 'SEAT CANCELLED',
			'seatUpdatedToBoardingPass': 'SEAT UPDATED TO BOARDING PASS',
			'changedSeat': 'CHANGED SEAT',
			'responseFromOtherCarrier': 'RESPONSE FROM OTHER CARRIER',
			'checkedInSeat': 'CHECKED IN SEAT',
			'addedPurchaserField': 'ADDED PURCHASER FIELD',
			'changedPurchaserField': 'CHANGED PURCHASER FIELD',
			'addedActionField': 'ADDED ACTION FIELD',
			'changedActionField': 'CHANGED ACTION FIELD',
			'addedSpecialRemarks': 'ADDED SPECIAL REMARKS',
			'changedOrDeletedSpecialRemarks': 'CHANGED OR DELETED SPECIAL REMARKS',
			'addedFareField': 'ADDED FARE FIELD',
			'changedFareField': 'CHANGED FARE FIELD',
			'addedPtaNumber': 'ADDED PTA NUMBER',
			'addedRoutingField': 'ADDED ROUTING FIELD',
			'changedRoutingField': 'CHANGED ROUTING FIELD',
			'addedName': 'ADDED NAME',
			'deletedName': 'DELETED NAME',
			'frequentFlyerDataAdded': 'FREQUENT FLYER DATA ADDED',
			'frequentFlyerDataDeleted': 'FREQUENT FLYER DATA DELETED',
			'addedTicketArrangement': 'ADDED TICKET ARRANGEMENT',
			'changedTicketingArrangement': 'CHANGED TICKETING ARRANGEMENT',
			'addedSsr': 'ADDED SSR',
			'changedOrDeletedSsr': 'CHANGED OR DELETED SSR',
			'addedOsi': 'ADDED OSI',
			'changedOrDeletedOsi': 'CHANGED OR DELETED OSI',
			'addedFormOfPayment': 'ADDED FORM OF PAYMENT',
			'modifiedOrDeletedFormOfPayment': 'MODIFIED OR DELETED FORM OF PAYMENT',
			'changedOrDeletedPhone': 'CHANGED OR DELETED PHONE',
			'addedCorporateId': 'ADDED CORPORATE ID',
			'deletedCorporateId': 'DELETED CORPORATE ID',
			'addedAddress': 'ADDED ADDRESS',
			'changedOrDeletedAddress': 'CHANGED OR DELETED ADDRESS',
			'addedTicketRemark': 'ADDED TICKET REMARK',
			'modifiedOrDeletedTicketRemark': 'MODIFIED OR DELETED TICKET REMARK',
			'addedDocument': 'ADDED DOCUMENT',
			'addedArne': 'ADDED ARNE',
			'addedQepSignature': 'ADDED QEP SIGNATURE',
			'addedQueuePlace': 'ADDED QUEUE PLACE',
			'addedTicketing': 'ADDED TICKETING',
			'addedPricing': 'ADDED PRICING',
			'incomingSsr': 'INCOMING SSR',
			'mcoCreatedAndSaved': 'MCO CREATED AND SAVED',
			'mcoChanged': 'MCO CHANGED',
			'addedManualFareQuoteField': 'ADDED MANUAL FARE QUOTE FIELD',
			'outgoingSsr': 'OUTGOING SSR',
			'changedOrDeletedManualFqField': 'CHANGED OR DELETED MANUAL FQ FIELD',
			'changedOrDeletedApolloQcRemark': 'CHANGED OR DELETED APOLLO QC REMARK',
			'replacedTinsRemark': 'REPLACED TINS REMARK',
			'replacedRecordLocator': 'REPLACED RECORD LOCATOR',
			'changedOrDeletedAtfq': 'CHANGED OR DELETED ATFQ',
			'apolloPostscript': 'APOLLO POSTSCRIPT',
			'changedOrDeletedCustomerIdField': 'CHANGED OR DELETED CUSTOMER ID FIELD',
			'queueRemoved': 'QUEUE REMOVED',
			'addedQualifiedRemark': 'ADDED QUALIFIED REMARK',
			'modifiedOrDeletedQualifiedRemark': 'MODIFIED OR DELETED QUALIFIED REMARK',
			'addedDeliveryAddress': 'ADDED DELIVERY ADDRESS',
			'modifiedOrDeletedDeliveryAddress': 'MODIFIED OR DELETED DELIVERY ADDRESS',
		};
		return $labels[$status] || $status;
	}

	static displayHistoricalSegment($number, $segment) {
		let $pattern, $data;
		$pattern = '## AAFFFFB DDDDD PPPSSS TT\/UUN  IIIII JJJJJ+* MM';
		$data = {
			'#': [$number, 'right'],
			'A': [$segment['airline'], 'right'],
			'F': [$segment['flightNumber'], 'right'],
			'B': [$segment['bookingClass'], 'right'],
			'D': [$segment['departureDate']['raw'], 'right'],
			'P': [$segment['departureAirport'], 'right'],
			'S': [$segment['destinationAirport'], 'right'],
			'T': [$segment['segmentStatusWas'], 'right'],
			'U': [$segment['segmentStatusBecame'], 'right'],
			'N': [$segment['seatCount'], 'left'],
			'I': [$segment['departureTime']['raw'], 'right'],
			'J': [$segment['destinationTime']['raw'], 'right'],
			'+': [' ', 'right'], // TODO
			'*': [$segment['confirmedByAirline'], 'right'],
			'M': [$segment['marriage'], 'right'],
		};
		return StringUtil.formatLine($pattern, $data);
	}

	static displaySegment($number, $segment, $action) {
		let $pattern, $data;
		$pattern = '   AAFFFFB DDDDD PPPSSS TT\/UUN IIIII JJJJJ+* ';
		$data = {
			'A': [$segment['airline'], 'right'],
			'F': [$segment['flightNumber'], 'right'],
			'B': [$segment['bookingClass'], 'right'],
			'D': [$segment['departureDate']['raw'], 'right'],
			'P': [$segment['departureAirport'], 'right'],
			'S': [$segment['destinationAirport'], 'right'],
			'T': [$segment['segmentStatusWas'], 'right'],
			'U': [$segment['segmentStatusBecame'], 'right'],
			'N': [$segment['seatCount'], 'left'],
			'I': [($segment['departureTime'] || '')['raw'], 'right'],
			'J': [($segment['destinationTime'] || '')['raw'], 'right'],
			'+': [' ', 'right'], // TODO
			'*': [$segment['confirmedByAirline'], 'right'],
		};
		return StringUtil.formatLine($pattern, $data) + '- ' + this.getStatusLabel($action);
	}

	static displayRcvdHeader($rcvd, $historical) {
		let $lines, $params;
		$lines = [];
		if (!$rcvd['rcvd']['receivedDt']) {
			return $rcvd['rcvd']['raw'] || JSON.stringify($rcvd['rcvd']);
		}
		$params = {
			'date': php.strtoupper(php.date('dM', php.strtotime('2016-' + $rcvd['rcvd']['receivedDt']['date']))),
			'time': $rcvd['rcvd']['receivedDt']['time'],
			'timeZone': $rcvd['rcvd']['receivedDt']['timeZone'],
			'agent': ($rcvd['rcvd']['originData'] || {})['receivedFrom'] || 'NO ID',
			'pcc': $rcvd['rcvd']['pcc'],
			'historical': $historical ? 'HISTORICAL SEGMENTS' : '',
		};
		$lines.push(StringUtil.format('{date} \/ {time} {timeZone}. BY: {agent}. PCC: {pcc}. {historical}', $params));
		$lines.push('');
		return php.implode(php.PHP_EOL, $lines);
	}

	static displayRcvdFooter($rcvd, $historical) {
		let $lines;
		$lines = [
			' ',
			'**********************************************************',
			' ',
		];
		return php.implode(php.PHP_EOL, $lines);
	}

	static displayRcvdHistoricalSegments($rcvd) {
		let $lines, $i, $action, $segment;
		$lines = [];
		$i = 1;
		for ($action of Object.values($rcvd['actions'])) {
			$segment = $action['content']['parsed'];
			if ($segment) {
				$lines.push(this.displayHistoricalSegment($i, $segment));
			} else {
				// failed to parse segment, fallback to raw line
				$lines.push(php.substr('  ' + $i + ' ', -3) + $action['content']['raw']);
			}
			$i++;
		}
		return php.implode(php.PHP_EOL, $lines);
	}

	static displayRcvdSegments($rcvd) {
		let $lines, $i, $action, $segment, $type;
		$lines = [];
		$i = 1;
		for ($action of Object.values($rcvd['actions'])) {
			$segment = $action['content']['parsed'];
			$type = $action['code']['parsed'] || $action['code']['raw'];
			if ($segment) {
				$lines.push(this.displaySegment($i, $segment, $type));
			} else {
				// failed to parse segment, fallback to raw line
				$lines.push('   ' + $action['content']['raw'] + ' - ' + $action['code']['raw']);
			}
			$i++;
		}
		return php.implode(php.PHP_EOL, $lines);
	}

	static displayFirstRcvd($rcvd) {
		let $lines;
		$lines = [];
		$lines.push(this.displayRcvdHeader($rcvd, true));
		$lines.push(this.displayRcvdHistoricalSegments($rcvd));
		$lines.push(this.displayRcvdFooter($rcvd));
		return php.implode(php.PHP_EOL, $lines);
	}

	static displayRcvd($rcvd) {
		let $lines;
		$lines = [];
		$lines.push(this.displayRcvdHeader($rcvd));
		$lines.push(this.displayRcvdSegments($rcvd));
		$lines.push(this.displayRcvdFooter($rcvd));
		return php.implode(php.PHP_EOL, $lines);
	}

	/** @param $history = PnrHistoryParser::parse() */
	static display($history) {
		let $lines, $rcvdList, $firstRcvd, $rcvd;
		if (php.empty($history['rcvdList'])) {
			return 'INVLD';
		}
		$lines = [
			'     *****  ' + ($history['header'] || 'HISTORY') + '  *****',
			' ',
			' ',
		];
		$rcvdList = $history['rcvdList'];
		$firstRcvd = php.array_shift($rcvdList);
		if ($firstRcvd) {
			$lines.push(this.displayFirstRcvd($firstRcvd));
		}
		for ($rcvd of Object.values($rcvdList)) {
			$lines.push(this.displayRcvd($rcvd));
		}
		return php.implode(php.PHP_EOL, $lines);
	}
}

module.exports = DisplayHistoryActionHelper;
