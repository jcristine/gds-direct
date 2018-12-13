
const {boolval, empty, intval, isset, strtoupper, trim, PHP_EOL, json_encode} = require('../../php.es6');
const TerminalSettings = require('../../App/Models/Terminal/TerminalSettings.es6');
class ValidateException extends Error {}

/** @debug */
var require = (path) => {
	let reportError = (name) => { throw new Error('Tried to use ' + name + ' of untranspilled module - ' + path) };
	return new Proxy({}, {
		get: (target, name) => reportError(name),
		set: (target, name, value) => reportError(name),
	});
};

const AuthSession = require('App/Classes/Core/AuthSession');
//const ValidateException = require('App/Classes/Core/Exceptions/ValidateException');
const FlightOptionRemarks = require('../../App/ModelHelpers/FlightOptionRemarks.es6');
const ItineraryHelper = require('../../App/ModelHelpers/ItineraryHelper.es6');
const ItinerarySegmentsHelper = require('../../App/ModelHelpers/ItinerarySegmentsHelper.es6');
const Airline = require('../../App/Models/Airline.es6');
const Airport = require('../../App/Models/Airport.es6');
const Baggage = require('../../App/Models/Baggage.es6');
const City = require('../../App/Models/City.es6');
const Country = require('../../App/Models/Country.es6');
const Currency = require('../../App/Models/Currency.es6');
const FlightOption = require('../../App/Models/FlightOption.es6');
const FlightOptionPrices = require('../../App/Models/FlightOptionPrices.es6');
const FlightOptionsAddedGroups = require('../../App/Models/FlightOptionsAddedGroups.es6');
const FlightOptionSources = require('../../App/Models/FlightOptionSources.es6');
const FlightOptionStatuses = require('../../App/Models/FlightOptionStatuses.es6');
const FlightOptionType = require('../../App/Models/FlightOptionType.es6');
const Gds = require('../../App/Models/Gds.es6');
const Itinerary = require('../../App/Models/Itinerary.es6');
const ItinerarySegments = require('../../App/Models/ItinerarySegments.es6');
const LeadsDestinations = require('../../App/Models/LeadsDestinations.es6');
const PassengerTypes = require('../../App/Models/PassengerTypes.es6');
const TerminalBuffering = require('../../App/Models/Terminal/TerminalBuffering.es6');
const TerminalInputLanguages = require('../../App/Models/Terminal/TerminalInputLanguages.es6');
const TerminalLogsGz = require('../../App/Models/TerminalLogsGz.es6');
const TravelRequests = require('../../App/Models/TravelRequests.es6');
const TerminalService = require('../../App/Services/TerminalService.es6');
const SQLException = require('../../Dyninno/Core/Exception/SQLException.es6');
const Log = require('../../Dyninno/Core/Logger/Log.es6');
const InvalidArgumentException = require('../../Psr/SimpleCache/InvalidArgumentException.es6');

class TerminalBaseController {

	// original php constructor params
	// $terminalService;
	// $requestGeoRepository;
	// $terminalBufferingRepository;
	// $requestAssignHistoryRepository;
	// $rbsService;
	// $flightOptionGeo;
	// $baggageAdapterService;

	/** @param {IEmcResult} emcResult */
	constructor(emcResult) {
		this.emcResult = emcResult;
	}

	/**
	 * TerminalBaseController constructor.
	 * @param TemplateInterface $template
	 * @param TerminalService $terminalService
	 * @param RequestGeoRepository $requestGeoRepository
	 * @param TerminalBufferingRepository $terminalBufferingRepository
	 * @param RbsService $rbsService
	 * @param RefundableHotelFinder $refunableHotelFinder
	 */
	constructorOld($template, $terminalService, $requestGeoRepository, $terminalBufferingRepository, $requestAssignHistoryRepository, $rbsService, $flightOptionGeo, $baggageAdapterService) {
		this.$terminalService = $terminalService;
		this.$requestGeoRepository = $requestGeoRepository;
		this.$terminalBufferingRepository = $terminalBufferingRepository;
		this.$requestAssignHistoryRepository = $requestAssignHistoryRepository;
		this.$rbsService = $rbsService;
		this.$flightOptionGeo = $flightOptionGeo;
		this.$baggageAdapterService = $baggageAdapterService;
	}

	// for compatibility
	json(value) {
		return value;
	}

	/**
	 * @param Request $request
	 * @return \Dyninno\Core\Http\JsonResponse
	 * @throws \Exception
	 * @throws \GuzzleHttp\Exception\GuzzleException
	 */
	commandAction($request) {
		if (!empty($request.post())) {

			let $terminalData = $request.post('terminalData', []);

			let $command = $request.post('command', null);
			let $gds = $request.post('gds', Gds.GDS_APOLLO);
			let $language = $request.post('language', TerminalInputLanguages.LANGUAGE_APOLLO);
			let $terminal = intval($request.post('terminalIndex', 1));
			let $requestId = intval($terminalData['rId'] || 0);
			let $isStandAlone = boolval($terminalData['isStandAlone'] || false);

			try {
				let $response = this.$terminalService.executeCommand($command, $gds, $requestId, $language, $terminal, $isStandAlone);
			} catch ($e) {
				let $response = {'output': TerminalService.ERROR_CANT_EXECUTE_COMMAND,};
			}

		} else {
			let $response = {'output': TerminalService.ERROR_NO_PARAMS,};
		}
		try {
			let $result = this.json({'data': $response, 'success': true,});
		} catch ($e) {
			Log.warning("Command action error: " + $e.message, [$response, $e.getTraceAsString()]);
			throw $e;
		}
		return $result;
	}

	/**
	 * @param Request $request
	 * @return \Dyninno\Core\Http\JsonResponse
	 * @throws \Dyninno\Core\Exception\SQLException
	 * @throws \Psr\SimpleCache\InvalidArgumentException
	 * @throws \GuzzleHttp\Exception\GuzzleException
	 * @throws \Dyninno\DiagService\DiagServiceException
	 */
	priceQuoteAction($request) {
		let $result = [];
		let $success = false;
		let $requestId = $request.get('rId');
		let $isStandAlone = boolval($request.get('isStandAlone', false));
		let $data = this.$terminalService.getPriceQuote($requestId, $isStandAlone);
		if (isset($data['canCreatePq']) && +$data['canCreatePq'] == 1) {

			try {

				if (empty($data['pccId'])) {
					throw  new ValidateException(lg('Undefined PCC'));
				}

				let $result = this.savePriceQuote($requestId, $data);

				$data['destinations'] = this.getPQDestinations($result['segments'], $data['passengersCount']);
				delete $result['segments'];

				let $success = !empty($result['flId']) && !empty($result['itineraryId']);

			} catch ($exception) {
				$result['error'] = $exception.message;
			}

		} else {
			if (isset($data['canCreatePqErrors'][0])) {
				$data['canCreatePqErrors'] = $data['canCreatePqErrors'][0];
			} else {
				$data['canCreatePqErrors'] = lg("Can't createPrice Quote");
			}
		}
		return this.json({
			'data': this.$terminalService.clearPriceQuoteResponse($data),
			'result': $result,
			'success': $success,
		});
	}

	/**
	 * @param Request $request
	 */
	importPriceQuoteAction($request) {
		let $success = false;
		let $result = {errors: []};
		let $requestId = $request.get('rId');
		let $isStandAlone = boolval($request.get('isStandAlone', false));
		let $data = this.$terminalService.importPriceQuote($requestId, $isStandAlone);
		try {

			let $flightOption = FlightOption.getParamsClean().sendToMaster().filter({
				'leadId': $requestId,
				'createdBy': AuthSession.id(),
				'statusId': FlightOptionStatuses.ids([FlightOptionStatuses.STATUS_TERMINAL_TEMP, FlightOptionStatuses.STATUS_TERMINAL_PENDING, FlightOptionStatuses.STATUS_WAITING_FOR_APPROVAL]),
				'sourceId': FlightOptionSources.id(FlightOptionSources.SOURCE_TERMINAL),
			}).fields(['id', 'statusId']).orderBy(['id desc']).getOne();

			if (empty($flightOption.$id)) {
				throw new ValidateException('Can\'t found flightOption by requestId #' + $requestId);
			}

			let $itinerary = Itinerary.getParams().filter({
				'flightOptionId': $flightOption.$id,
				'rebuilded': 21,
			}).fields(['id']).orderBy(['id desc']).getOne();

			if (empty($itinerary.$id)) {
				throw new ValidateException('Can\'t found itinerary by flightOptionId #' + $flightOption.$id);
			}

			if (!empty($data['itineraries'])) {
				let $itinerarySegments = ItinerarySegmentsHelper.prepareToUpdate($itinerary.$id, $data['itineraries']);

				for (let $segment of $itinerarySegments) {
					ItinerarySegments.addUpdateRow($segment);
				}
				for (let [$k, [$el1]] of Object.entries($itinerarySegments)) {
					ItinerarySegments.addUpdateRow($segment);
				}

				let $totalTimes = ItineraryHelper.countTotalTimes($itinerarySegments);
				Itinerary.update({
					'id': $itinerary.$id,
					'totalTime': $totalTimes['totalTime'] || 0,
					'totalLayoverTime': $totalTimes['totalLayoverTime'] || 0,
					'rebuilded': 1,
				});

				this.savePublishedPricing($itinerary.$id, $data);

				if ($flightOption.$statusId == FlightOptionStatuses.id(FlightOptionStatuses.STATUS_TERMINAL_PENDING)) {
					FlightOption.setStatus(FlightOptionStatuses.STATUS_READY_TO_SEND, $flightOption.$id);
				} else {
					FlightOption.setStatus(FlightOptionStatuses.STATUS_TERMINAL_IMPORTED, $flightOption.$id);
				}
			} else {
				$result['errors'].push('Itinerary not defined');
			}

			if (!empty($data['baggage'])) {
				let $baggage = this.$baggageAdapterService.prepareData($itinerary.$id, $data['baggage']);
				if (!empty($baggage)) {
					Baggage.saveBaggage($itinerary.$id, $baggage);
					for (let $priceRecord of $baggage['flightOptionPrices'] || []) {
						FlightOptionPrices.update($priceRecord);
					}
				}
			} else {
				$result['errors'].push('Baggage not defined');
			}

			if (!empty($data['allCommands'])) {
				let $terminalLogs = TerminalLogsGz.prepareData($itinerary.$id, $data['allCommands']);
				for (let $log of $terminalLogs) {
					TerminalLogsGz.add($log);
				}
			} else {
				$result['errors'].push('allCommands not defined');
			}

			let $success = true;

		} catch ($exception) {
			$result['errors'].push($exception.message);
		}
		if (app().isProduction() && !AuthSession.isAdmin()) {
			let $data = {};
		}
		return {'data': $data, 'result': $result, 'success': $success};
	}

	/**
	 * @return \Dyninno\Core\Http\JsonResponse
	 * @throws \Exception
	 */
	clearBufferAction() {
		TerminalBuffering.setClear(AuthSession.id(), getRequest().get('rId'));
		return this.json({'data': [], 'success': true,});
	}

	/**
	 * @param Request $request
	 * @return \Dyninno\Core\Http\JsonResponse
	 * @throws InvalidArgumentException
	 * @throws SQLException
	 */
	getPriceQuotesAction($request) {
		let $result = [];
		let $success = true;
		let $filter = {
			'statusId': FlightOptionStatuses.ids([FlightOptionStatuses.STATUS_NEW, FlightOptionStatuses.STATUS_SENT, FlightOptionStatuses.STATUS_PRICE_QUOTE_SENT, FlightOptionStatuses.STATUS_SENT, FlightOptionStatuses.STATUS_SALE_CREATED]),
			'typeId': FlightOptionType.id(FlightOptionType.TYPE_PRICE_QUOTE),
		};
		if ($requestId = $request.get('rId')) {
			$filter['leadId'] = $requestId;
		}
		try {
			if (!$requestId) {
				throw new ValidateException('Empty params');
			}

			let $data = FlightOption.getParams().get($filter);

			for (let $flightOption of $data) {
				if ($passengerType = !empty($flightOption.$prices[PassengerTypes.TYPE_ADULT]) ? PassengerTypes.TYPE_ADULT : (!empty($flightOption.$prices[PassengerTypes.TYPE_CHILD]) ? PassengerTypes.TYPE_CHILD : false)) {

					let $element = {
						'id': !empty($flightOption.$id) ? $flightOption.$id : 0,
						'flightOptionId': !empty($flightOption.$flightOptionId) ? $flightOption.$flightOptionId : 0,
						'source': !empty($flightOption.$source) ? $flightOption.$source : null,
						'passengerType': $passengerType,
						'pqStatusName': !empty($flightOption.$pqStatusName) ? $flightOption.$pqStatusName : null,
						'pqStatusLabel': !empty($flightOption.$pqStatusLabel) ? $flightOption.$pqStatusLabel : null,
						'addedByGroup': !empty($flightOption.$addedByGroup) ? $flightOption.$addedByGroup : null,
						'addedByGroupLabel': !empty($flightOption.$addedByGroupLabel) ? $flightOption.$addedByGroupLabel : null,
						'net': !empty($flightOption.$prices[$passengerType]['net']) ? $flightOption.$prices[$passengerType]['net'] : 0,
						'selling': !empty($flightOption.$prices[$passengerType]['amount']) ? $flightOption.$prices[$passengerType]['amount'] : 0,
						'reservationDump': !empty($flightOption.$reservationDumpClean) ? $flightOption.$reservationDumpClean : null,
					};

					$result.push($element);
				}
			}

		} catch ($exception) {
			let $success = false;
			$result['errors'] = $exception.message;
		}
		$result = arraySort($result, 'net');
		return this.json({'result': $result, 'success': $success,});
	}

	/**
	 * @param $name
	 * @param $currentGds
	 * @param $value
	 */
	saveSettingAction($name, $currentGds, $value) {
		let saving;
		let agentSettings = new TerminalSettings(this.emcResult);
		switch ($name) {
			case 'gds':
				saving = agentSettings.setCurrentGds($value);
				break;
			case 'language':
				saving = agentSettings.setSetting($currentGds, 'languageId', TerminalInputLanguages.id($value));
				break;
			case 'terminal':
				saving = agentSettings.setSetting($currentGds, 'terminalNumber', $value);
				break;
			case 'fontSize':
				saving = agentSettings.setSetting($currentGds, 'fontSize', $value);
				break;
			case 'theme':
				saving = agentSettings.setSetting($currentGds, 'terminalTheme', $value);
				break;
			default:
				saving = Promise.reject('Cant save settings. Unknown key - ' + $name);
				break;
		}
		// TODO: should fix - frontend takes userMessages from data.userMessages instead of data.data.userMessages
		return saving
			.then(sqlResult => ({success: true, data: {data: {userMessages: ['Ok writing ' + $name]}}}))
			.catch(exc => ({success: false, data: {userMessages: ['Failure - ' + exc]}}));
	}

	/**
	 * @param Request $request
	 * @param string $name
	 * @param string $currentGds
	 */
	postSaveSettingAction($value, $name, $currentGds) {
		let agentSettings = new TerminalSettings(this.emcResult);
		let saving;
		switch ($name) {
			case 'settings':
				let promises = [];
				for (let [$gds, $data] of Object.entries($value)) {
					promises.push(agentSettings.setSettings($gds, {
						'keyBindings': $data['keyBindings'] == '' ? ''
							: json_encode($data['keyBindings']),
					}));
					let $areaSettings = $data['areaSettings'] || [];
					promises.push(agentSettings.setAreaSettings($gds, $areaSettings));
				}
				saving = Promise.all(promises);
				break;
			case 'matrixConfiguration':
				// make sure int numbers are not strings
				$value = {
					hasWide: $value.hasWide,
					matrix: {
						rows: +$value.matrix.rows,
						cells: +$value.matrix.cells,
						list: $value.matrix.list.map(num => +num),
					},
				};
				let $configuration = json_encode($value);
				saving = agentSettings.setSetting($currentGds, 'matrixConfiguration', $configuration);
				break;
			default:
				saving = Promise.reject('Cant save settings. Unknown key - ' + $name);
				break;
		}
		// TODO: should fix - frontend takes userMessages from data.userMessages instead of data.data.userMessages
		return saving
			.then(sqlResult => ({success: true, data: {data:{userMessages: ['Ok writing ' + $name]}}}))
			//.catch(exc => ({success: false, data: {userMessages: ['Failure - ' + exc]}}))
			;
	}

	/**
	 * @param $requestId
	 * @param $data
	 * @return array
	 * @throws \Dyninno\Core\Exception\SQLException
	 * @throws \Psr\SimpleCache\InvalidArgumentException
	 * @throws ValidateException
	 * @throws \Dyninno\DiagService\DiagServiceException
	 */
	savePriceQuote($requestId, $data) {
		let $result = [];
		let $rqDestinations = LeadsDestinations.getParams().filter({'leadId': $requestId,}).get();
		let $rbsSegments = $data['itineraries'];
		let $segments = ItinerarySegmentsHelper.prepareToInsert($requestId, $rbsSegments);
		let $errors = this.$flightOptionGeo.checkPqMatchesRequest($rqDestinations, $rbsSegments);
		if ($errors) {
			throw new ValidateException('The itinerary of the submitted Price Quote DOES NOT match with Geo-Information of this Travel Request. Please verify the details and try again. ' + implode('; ', $errors));
		}
		let $flightOption = new FlightOption();
		$flightOption.setLeadId($requestId);
		$flightOption.setCompanyId(TravelRequests.getCleanById($requestId).getCompanyId());
		$flightOption.setCreateTime(date(DATE_TIME_FORMAT));
		$flightOption.setCreatedBy(AuthSession.id());
		$flightOption.setStatusId(FlightOptionStatuses.id(FlightOptionStatuses.STATUS_TERMINAL_TEMP));
		$flightOption.setSourceId(FlightOptionSources.id(FlightOptionSources.SOURCE_TERMINAL));
		$flightOption.setTypeId(FlightOptionType.id(FlightOptionType.TYPE_PRICE_QUOTE));
		$flightOption.setAddedByGroupId(FlightOptionsAddedGroups.id(FlightOptionsAddedGroups.getGroup()));
		$flightOption.setRemarksForCustomer(json_encode(''));
		$flightOption.setInternalRemarks(json_encode(FlightOptionRemarks.prepareManualRemarks('')));
		$flightOption.setMileagesId(0);
		$flightOption.setClonedFrom(0);
		$flightOption.save();
		TravelRequests.incFlightOptionsCount($requestId);
		TravelRequests.log($requestId, $flightOption.asArray(), null, $flightOption.$id);
		$result['flId'] = $flightOption.$id;
		if (!$flightOption.$id) {
			throw new ValidateException('Error: Can create PQ');
		}
		let $itinerary = new Itinerary();
		$itinerary.setFlightOptionId($flightOption.$id);
		$itinerary.setCreateTime(date(DATE_TIME_FORMAT));
		$itinerary.setCreatedBy(AuthSession.id());
		$itinerary.setPnr($data['pnr'] || '');
		$itinerary.setReservationDump(json_encode(self.assemblyReservationDump($data['itineraries'])));
		$itinerary.setPccId($data['pccId'] || 0);
		$itinerary.setIsTourFare($data['isTourFare'] || 0);
		$itinerary.setPricingCount($data['pricingCount'] || 1);
		$itinerary.setRebuilded(21);
		$itinerary.setDefaultPlatingCarrier(!empty($data['validatingCarrier']) ? Airline.id($data['validatingCarrier'], 'code') : 0);
		$itinerary.setTotalLayoverTime(0);
		$itinerary.setTotalTime(0);
		$itinerary.setNotRequireDetails(0);
		$itinerary.setGdsId(isset($data['gds']) ? Gds.id($data['gds']) : 0);
		$itinerary.setIsBasicEconomy(isset($data['isBasicEconomy']) ? $data['isBasicEconomy'] : false);
		$itinerary.save();
		TravelRequests.log($requestId, $itinerary.asArray(), null, $itinerary.$id);
		$result['itineraryId'] = $itinerary.$id;
		if (!$itinerary.$id) {
			throw new ValidateException('Error: Can create PQ');
		}
		this.saveFlightOptionPrices($requestId, $itinerary.$id, $data);

		for (let i = 0; i < $segments.length; ++i) {
			let $segment = $segments[i];
			$segment['itineraryId'] = $itinerary.$id;
			$result['newSegments'][i]['id'] = ItinerarySegments.add($segment);
		}
		$result['segments'] = $segments;
		return $result;
	}

	/**
	 * @param $itinerarySegments
	 * @return string
	 */
	assemblyReservationDump($itinerarySegments) {
		let $dump = '';
		for (let $segment of $itinerarySegments) {
			$dump += PHP_EOL + trim($segment['raw']);
		}
		return $dump;
	}

	/**
	 * @param $requestId
	 * @param $itineraryId
	 * @param $data
	 * @throws \Dyninno\Core\Exception\SQLException
	 * @throws \Psr\SimpleCache\InvalidArgumentException
	 */
	saveFlightOptionPrices($requestId, $itineraryId, $data) {
		let $passengers = LeadsDestinations.getMaxPassengersCount($requestId);
		for (let [$passengerType, $defined] of Object.entries($passengers)) {
			if ($defined) {

				let $price = new FlightOptionPrices();
				$price.setItineraryId($itineraryId);
				$price.setPassengerTypeId(PassengerTypes.id($passengerType));
				$price.setAmountCharged(0);
				$price.setNetPrice(isset($data['netPrices'][$passengerType]['amount']) ? $data['netPrices'][$passengerType]['amount'] : 0);
				$price.setCurrencyId(!empty($data['currency']) ? Currency.id($data['currency']) : Currency.id('USD'));
				$price.setFarePrice(isset($data['farePrices'][$passengerType]['amount']) ? $data['farePrices'][$passengerType]['amount'] : 0);
				$price.setCorrectAgentPricingFormat($data['correctAgentPricingFormat']);
				$price.setIncentiveAmount($data['agencyIncentives'][$passengerType]);
				$price.setMarkup(0);
				$price.save();
			}
		}
	}

	/**
	 * @param array $segments
	 * @param array $passengersCount
	 * @return array
	 * @throws InvalidArgumentException
	 * @throws SQLException
	 */
	getPQDestinations($segments, $passengersCount) {
		let $result = [];
		for (let $segment of $segments) {
			/** @var Airport $destinationAirport */
			let $destinationAirport = Airport.getById($segment['destinationAirportId']);
			$row['destinationCityId'] = $destinationAirport.getCityId();
			$row['destinationCountryId'] = $destinationAirport.getCountryId();
			$row['destinationCityName'] = City.name($destinationAirport.getCityId());
			$row['destinationCountryName'] = Country.name($destinationAirport.getCountryId());
			$row['destinationDate'] = $segment['destinationDateTime'];
			$row['isDestination'] = intval($segment['isDestination']);
			$row['adults'] = $passengersCount['adult'] || 0;
			$row['childs'] = $passengersCount['child'] || 0;
			$row['infants'] = $passengersCount['infant'] || 0;
			unset($destinationAirport);
			$result.push($row);
		}
		return $result;
	}

	/**
	 * @param $itineraryId
	 * @param $data
	 * @throws \Dyninno\Core\Exception\SQLException
	 * @throws \Psr\SimpleCache\InvalidArgumentException
	 */
	savePublishedPricing($itineraryId, $data) {
		/** @var FlightOptionPrices $prices */
		let $prices = FlightOptionPrices.get({'itineraryId': $itineraryId,});
		for (let $price of $prices) {
			$price.setPublishedPrice(isset($data['publishedPrices'][PassengerTypes.name($price.getPassengerTypeId())]['amount']) ? $data['publishedPrices'][PassengerTypes.name($price.getPassengerTypeId())]['amount'] : 0);
			$price.save();
		}
	}
}

module.exports = TerminalBaseController;