const TravelportClient = require('../../../../backend/GdsClients/Transformers/TravelportPnrRequest');

const provide_buildXml = () => {
	const list = [];

	list.push({
		title: 'Build correct request xml object',
		input: {
			addAirSegments: [{
				airline: 'AA',
				flightNumber: '0127',
				bookingClass: 'C',
				departureDt: '2020-05-20',
				destinationDt: null,
				departureAirport: 'JFK',
				destinationAirport: 'MNL',
				segmentStatus: 'GK',
				seatCount: 2,
				marriage: 3,
			}],
		},
		output: [
			'<SessionMods>',
			"<AreaInfoReq/>",
			'</SessionMods>',
			'<PNRBFRetrieveMods>',
			'<CurrentPNR/>',
			'</PNRBFRetrieveMods>',
			'<AirSegSellMods>',
			'<AirSegSell>',
			'<Vnd>AA</Vnd>',
			'<FltNum>0127</FltNum>',
			'<Class>C</Class>',
			'<StartDt>20200520</StartDt>',
			'<StartAirp>JFK</StartAirp>',
			'<EndAirp>MNL</EndAirp>',
			'<Status>GK</Status>',
			'<NumPsgrs>2</NumPsgrs>',
			'<StartTm/>',
			'<EndTm/>',
			'<DtChg/>',
			'<AvailDispType>G</AvailDispType>',
			'</AirSegSell>',
			'</AirSegSellMods>',
		].join(''),
	});

	list.push({
		title: 'Build correct request xml object with multiple air segments',
		input: {
			"addAirSegments": [{
				"airline": "PR",
				"flightNumber": "127",
				"bookingClass": "C",
				"departureDt": "2020-05-20",
				"destinationDt": null,
				"departureAirport": "JFK",
				"destinationAirport": "MNL",
				"segmentStatus": "GK",
				"seatCount": 1,
			}, {
				"airline": "PR",
				"flightNumber": "126",
				"bookingClass": "C",
				"departureDt": "2020-05-25",
				"destinationDt": null,
				"departureAirport": "MNL",
				"destinationAirport": "JFK",
				"segmentStatus": "GK",
				"seatCount": 1,
			}],
		},
		output: [
			'<SessionMods>',
			'<AreaInfoReq/>',
			'</SessionMods>',
			'<PNRBFRetrieveMods>',
			'<CurrentPNR/>',
			'</PNRBFRetrieveMods>',
			'<AirSegSellMods>',
			'<AirSegSell>',
			'<Vnd>PR</Vnd>',
			'<FltNum>0127</FltNum>',
			'<Class>C</Class>',
			'<StartDt>20200520</StartDt>',
			'<StartAirp>JFK</StartAirp>',
			'<EndAirp>MNL</EndAirp>',
			'<Status>GK</Status>',
			'<NumPsgrs>1</NumPsgrs>',
			'<StartTm/>',
			'<EndTm/>',
			'<DtChg/>',
			'<AvailDispType>G</AvailDispType>',
			'</AirSegSell>',
			'<AirSegSell>',
			'<Vnd>PR</Vnd>',
			'<FltNum>0126</FltNum>',
			'<Class>C</Class>',
			'<StartDt>20200525</StartDt>',
			'<StartAirp>MNL</StartAirp>',
			'<EndAirp>JFK</EndAirp>',
			'<Status>GK</Status>',
			'<NumPsgrs>1</NumPsgrs>',
			'<StartTm/>',
			'<EndTm/>',
			'<DtChg/>',
			'<AvailDispType>G</AvailDispType>',
			'</AirSegSell>',
			'</AirSegSellMods>',
		].join(''),
	});

	list.push({
		title: 'Build correct request xml object with start and end dates',
		input: {
			addAirSegments: [{
				airline: 'AA',
				flightNumber: '0127',
				bookingClass: 'C',
				departureDt: '2020-05-20 12:00:00',
				destinationDt: '2020-05-21 12:00:00',
				departureAirport: 'JFK',
				destinationAirport: 'MNL',
				segmentStatus: 'GK',
				seatCount: 2,
				marriage: 3,
			}],
		},
		output: [
			'<SessionMods>',
			"<AreaInfoReq/>",
			'</SessionMods>',
			'<PNRBFRetrieveMods>',
			'<CurrentPNR/>',
			'</PNRBFRetrieveMods>',
			'<AirSegSellMods>',
			'<AirSegSell>',
			'<Vnd>AA</Vnd>',
			'<FltNum>0127</FltNum>',
			'<Class>C</Class>',
			'<StartDt>20200520</StartDt>',
			'<StartAirp>JFK</StartAirp>',
			'<EndAirp>MNL</EndAirp>',
			'<Status>GK</Status>',
			'<NumPsgrs>2</NumPsgrs>',
			'<StartTm>1200</StartTm>',
			'<EndTm>1200</EndTm>',
			'<DtChg>1</DtChg>',
			'<AvailDispType>G</AvailDispType>',
			'</AirSegSell>',
			'</AirSegSellMods>',
		].join(''),
	});

	list.push({
		title: 'Build correct request xml object with retrieve mode',
		input: {
			addAirSegments: [{
				airline: 'AA',
				flightNumber: '0127',
				bookingClass: 'C',
				departureDt: '2020-05-20 12:00:00',
				destinationDt: '2020-05-21 12:00:00',
				departureAirport: 'JFK',
				destinationAirport: 'MNL',
				segmentStatus: 'GK',
				seatCount: 2,
				marriage: 3,
			}],
			recordLocator: 'something',
		},
		output: [
			'<SessionMods>',
			"<AreaInfoReq/>",
			'</SessionMods>',
			'<PNRBFRetrieveMods>',
			'<PNRAddr>',
			'<RecLoc>something</RecLoc>',
			'</PNRAddr>',
			'</PNRBFRetrieveMods>',
			'<AirSegSellMods>',
			'<AirSegSell>',
			'<Vnd>AA</Vnd>',
			'<FltNum>0127</FltNum>',
			'<Class>C</Class>',
			'<StartDt>20200520</StartDt>',
			'<StartAirp>JFK</StartAirp>',
			'<EndAirp>MNL</EndAirp>',
			'<Status>GK</Status>',
			'<NumPsgrs>2</NumPsgrs>',
			'<StartTm>1200</StartTm>',
			'<EndTm>1200</EndTm>',
			'<DtChg>1</DtChg>',
			'<AvailDispType>G</AvailDispType>',
			'</AirSegSell>',
			'</AirSegSellMods>',
		].join(''),
	});

	return list.map(a => [a]);
};

const provide_parseXml = () => {
	const list = [];

	list.push({
		title: 'Build correct result object from soap response',
		input: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>D</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>Y</PNRDataInd><PNRName>NO NAMES</PNRName><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><PNRBFRetrieve><Control><KLRCnt>4</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr><Klr><ID>IT01</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190729</CurDtStamp><CurTmStamp>093759</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>Y</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo><AirSeg><SegNum>1</SegNum><Status>GK</Status><Dt>20200520</Dt><DayChg>01</DayChg><AirV>PR</AirV><NumPsgrs>1</NumPsgrs><StartAirp>JFK</StartAirp><EndAirp>MNL</EndAirp><StartTm>145</StartTm><EndTm>615</EndTm><BIC>C</BIC><FltNum>127</FltNum><OpSuf/><COG>N</COG><TklessInd>N</TklessInd><ConxInd>N</ConxInd><FltFlownInd>N</FltFlownInd><MarriageNum/><SellType/><StopoverIgnoreInd/><TDSValidateInd>N</TDSValidateInd><NonBillingInd>N</NonBillingInd><PrevStatusCode>GK</PrevStatusCode><ScheduleValidationInd/><VndLocInd/><OpAirVInd/></AirSeg></PNRBFRetrieve><AirSegSell><AirSell><DisplaySequenceNumber/><Vnd>PR</Vnd><FltNum>126</FltNum><OpSuf/><Class>C</Class><StartDt>20200525</StartDt><DtChg>0</DtChg><StartAirp>MNL</StartAirp><EndAirp>JFK</EndAirp><StartTm>1940</StartTm><EndTm>2315</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[OFFER CAR/HOTEL    |CAL	     |HOA	]]></Txt></TextMsg><TextMsg><Txt><![CDATA[DEPARTS MNL TERMINAL 1  - ARRIVES JFK TERMINAL 1]]></Txt></TextMsg><TextMsg><Txt>ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS</Txt></TextMsg><TextMsg><Txt>PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION</Txt></TextMsg><TextMsg><Txt>WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES</Txt></TextMsg><TextMsg><Txt>FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES</Txt></TextMsg></AirSegSell></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
		output: {
			"error": null,
			"reservation": {
				"itinerary": [{
					"segmentNumber": "1",
					"segmentStatus": "GK",
					"departureDate": {
						"raw": "20200520",
						"parsed": "2020-05-20",
					},
					"dayOffset": "01",
					"airline": "PR",
					"seatCount": "1",
					"departureAirport": "JFK",
					"destinationAirport": "MNL",
					"departureTime": {
						"raw": "0145",
						"parsed": "01:45:00",
					},
					"destinationTime": {
						"raw": "0615",
						"parsed": "06:15:00",
					},
					"bookingClass": "C",
					"flightNumber": "127",
					"marriage": "",
					"statusOld": "GK",
					"confirmedByAirlineIndicator": "",
					"isFlown": false,
					"scheduleValidationIndicator": "",
				}],
			},
			"newAirSegments": [{
				"success": true,
				"displaySequenceNumber": "",
				"airline": "PR",
				"flightNumber": "126",
				"bookingClass": "C",
				"departureDate": {
					"raw": "20200525",
					"parsed": "2020-05-25",
				},
				"dayOffset": "0",
				"departureAirport": "MNL",
				"destinationAirport": "JFK",
				"departureTime": {
					"raw": "1940",
					"parsed": "19:40:00",
				},
				"destinationTime": {
					"raw": "2315",
					"parsed": "23:15:00",
				},
				"segmentStatus": "GK",
				"seatCount": "1",
				"marriage": "",
				"aircraftChanges": false,
				"eticket": false,
				"isStopover": false,
				"operatedByCode": "",
				"messages": ["OFFER CAR\/HOTEL    |CAL\t     |HOA\t", "DEPARTS MNL TERMINAL 1  - ARRIVES JFK TERMINAL 1", "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS", "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION", "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES", "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES"],
			}],
		},
	});

	list.push({
		title: 'Build correct result object from soap response with multiple sells without itinerary',
		input: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>D</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>S</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>Y</PNRDataInd><PNRName>NO NAMES</PNRName><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><PNRBFRetrieve><Control><KLRCnt>3</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190729</CurDtStamp><CurTmStamp>093805</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>N</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo></PNRBFRetrieve><AirSegSell><AirSell><DisplaySequenceNumber/><Vnd>PR</Vnd><FltNum>127</FltNum><OpSuf/><Class>C</Class><StartDt>20200520</StartDt><DtChg>1</DtChg><StartAirp>JFK</StartAirp><EndAirp>MNL</EndAirp><StartTm>145</StartTm><EndTm>615</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[DEPARTS JFK TERMINAL 1  - ARRIVES MNL TERMINAL 1]]></Txt></TextMsg><AirSell><DisplaySequenceNumber/><Vnd>PR</Vnd><FltNum>126</FltNum><OpSuf/><Class>C</Class><StartDt>20200525</StartDt><DtChg>0</DtChg><StartAirp>MNL</StartAirp><EndAirp>JFK</EndAirp><StartTm>1940</StartTm><EndTm>2315</EndTm><Status>GK</Status><NumPsgrs>1</NumPsgrs><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>Y</SuccessInd><COG>N</COG><TklessInd>N</TklessInd><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><TextMsg><Txt><![CDATA[OFFER CAR/HOTEL    |CAL	     |HOA	]]></Txt></TextMsg><TextMsg><Txt><![CDATA[DEPARTS MNL TERMINAL 1  - ARRIVES JFK TERMINAL 1]]></Txt></TextMsg><TextMsg><Txt>ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS</Txt></TextMsg><TextMsg><Txt>PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION</Txt></TextMsg><TextMsg><Txt>WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES</Txt></TextMsg><TextMsg><Txt>FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES</Txt></TextMsg></AirSegSell></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
		output: {
			"reservation": {
				"itinerary": [],
			},
			"newAirSegments": [{
				"success": true,
				"displaySequenceNumber": "",
				"airline": "PR",
				"flightNumber": "127",
				"bookingClass": "C",
				"departureDate": {
					"raw": "20200520",
					"parsed": "2020-05-20",
				},
				"dayOffset": "1",
				"departureAirport": "JFK",
				"destinationAirport": "MNL",
				"departureTime": {
					"raw": "0145",
					"parsed": "01:45:00",
				},
				"destinationTime": {
					"raw": "0615",
					"parsed": "06:15:00",
				},
				"segmentStatus": "GK",
				"seatCount": "1",
				"marriage": "",
				"aircraftChanges": false,
				"eticket": false,
				"isStopover": false,
				"operatedByCode": "",
				"messages": ["DEPARTS JFK TERMINAL 1  - ARRIVES MNL TERMINAL 1"],
			}, {
				"success": true,
				"displaySequenceNumber": "",
				"airline": "PR",
				"flightNumber": "126",
				"bookingClass": "C",
				"departureDate": {
					"raw": "20200525",
					"parsed": "2020-05-25",
				},
				"dayOffset": "0",
				"departureAirport": "MNL",
				"destinationAirport": "JFK",
				"departureTime": {
					"raw": "1940",
					"parsed": "19:40:00",
				},
				"destinationTime": {
					"raw": "2315",
					"parsed": "23:15:00",
				},
				"segmentStatus": "GK",
				"seatCount": "1",
				"marriage": "",
				"aircraftChanges": false,
				"eticket": false,
				"isStopover": false,
				"operatedByCode": "",
				"messages": ["OFFER CAR\/HOTEL    |CAL\t     |HOA\t", "DEPARTS MNL TERMINAL 1  - ARRIVES JFK TERMINAL 1", "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA\/DOCO\/DOCS", "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION", "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES", "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES"],
			}],
		},
	});

	list.push({
		title: 'Build correct result object from soap response with error messages',
		input: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><TransactionErrorCode><Domain>AppErrorSeverityLevel</Domain><Code>1</Code></TransactionErrorCode><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>C</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><PNRBFRetrieve><Control><KLRCnt>3</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190731</CurDtStamp><CurTmStamp>043054</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>N</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo></PNRBFRetrieve><AirSegSell><ErrText><Err/><KlrInErr/><InsertedTextAry></InsertedTextAry><Text>INVALID DATE</Text></ErrText></AirSegSell></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
		output: {
			error: "Failed to sell segments - INVALID DATE",
			reservation: {
				itinerary: [],
			},
			newAirSegments: [],
		},
	});

	list.push({
		title: 'Build result object with air segment errors messages',
		input: '<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <soapenv:Body><SubmitXmlOnSessionResponse xmlns="http://webservices.galileo.com"><SubmitXmlOnSessionResult><PNRBFManagement_51 xmlns=""><TransactionErrorCode><Domain>AppErrorSeverityLevel</Domain><Code>1</Code></TransactionErrorCode><SessionInfo><AreaInfoResp><Sys>1V</Sys><Processor>B</Processor><GrpModeActivatedInd>N</GrpModeActivatedInd><AAAAreaAry><AAAAreaInfo><AAAArea>A</AAAArea><ActiveInd>Y</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials>WS</AgntInitials><Duty>AG</Duty><AgncyPCC>2F3K</AgncyPCC><DomMode>BASIC</DomMode><IntlMode>US-ECAC</IntlMode><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>B</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>C</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>D</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo><AAAAreaInfo><AAAArea>E</AAAArea><ActiveInd>A</ActiveInd><AAACity>QSB</AAACity><AAADept>YC</AAADept><SONCity>QSB</SONCity><SONDept>YC</SONDept><AgntID>ZDPBVWS</AgntID><ChkDigit/><AgntInitials/><Duty/><AgncyPCC/><DomMode/><IntlMode/><PNRDataInd>N</PNRDataInd><PNRName/><GrpModeActiveInd>A</GrpModeActiveInd><GrpModeDutyCode/><GrpModePCC/><GrpModeDataInd/><GrpModeName/></AAAAreaInfo></AAAAreaAry></AreaInfoResp></SessionInfo><PNRBFRetrieve><Control><KLRCnt>3</KLRCnt><KlrAry><Klr><ID>BP08</ID><NumOccur>1</NumOccur></Klr></KlrAry></Control><GenPNRInfo><FileAddr/><CodeCheck/><RecLoc/><Ver>0</Ver><OwningCRS>1V</OwningCRS><OwningAgncyName>INTERNATIONAL TRAVEL NET</OwningAgncyName><OwningAgncyPCC>2F3K</OwningAgncyPCC><CreationDt/><CreatingAgntSignOn/><CreatingAgntDuty/><CreatingAgncyIATANum/><OrigBkLocn/><SATONum/><PTAInd>N</PTAInd><InUseInd/><SimultaneousUpdInd/><BorrowedInd>N</BorrowedInd><GlobInd>N</GlobInd><ReadOnlyInd>N</ReadOnlyInd><FareDataExistsInd>N</FareDataExistsInd><PastDtQuickInd>N</PastDtQuickInd><CurAgncyPCC>2F3K</CurAgncyPCC><QInd>N</QInd><TkNumExistInd>N</TkNumExistInd><IMUdataexists>Y</IMUdataexists><ETkDataExistInd>N</ETkDataExistInd><CurDtStamp>20190731</CurDtStamp><CurTmStamp>045909</CurTmStamp><CurAgntSONID>DPBVWS</CurAgntSONID><TravInsuranceInd>N</TravInsuranceInd><PNRBFTicketedInd>N</PNRBFTicketedInd><ZeppelinAgncyInd>N</ZeppelinAgncyInd><AgncyAutoServiceInd>N</AgncyAutoServiceInd><AgncyAutoNotifyInd>N</AgncyAutoNotifyInd><ZeppelinPNRInd>N</ZeppelinPNRInd><PNRAutoServiceInd>N</PNRAutoServiceInd><PNRNotifyInd/><SuperPNRInd>N</SuperPNRInd><PNRBFPurgeDt>NO PURGE</PNRBFPurgeDt><PNRBFChangeInd>N</PNRBFChangeInd><MCODataExists>N</MCODataExists><OrigRcvdField/><IntContExists/><AllDataAllTime>N</AllDataAllTime><LastActAgntID/><TransPCCName>INTERNATIONAL TRAVEL NET</TransPCCName><URrecordLoc/><UROSindLoc>N</UROSindLoc><URRCBInd>N</URRCBInd><GMTPNRBFCreationDt/><PricingRecordExist>N</PricingRecordExist><ArchivedFeeDataExists>N</ArchivedFeeDataExists><LeisureshopperDataExists>N</LeisureshopperDataExists><SeatDataExists>N</SeatDataExists><FrequentFlyerDataExists>N</FrequentFlyerDataExists><NetTicketDataExists>N</NetTicketDataExists><TinsRemarksExist>N</TinsRemarksExist><ElectronicDataExists>N</ElectronicDataExists><AdditionalItineraryDataExists>N</AdditionalItineraryDataExists><GroupAllocationFileExists>N</GroupAllocationFileExists><ProfileAssociationsExist>N</ProfileAssociationsExist><VendorLocatorDataExists>N</VendorLocatorDataExists><BookingCodeDataExists/><ArneDataExists>N</ArneDataExists><TimaticDataExists>N</TimaticDataExists><LinearFareDataExists>N</LinearFareDataExists><ItineraryRemarksExist>N</ItineraryRemarksExist><IdentificationFieldExists>N</IdentificationFieldExists><EmailAddressExists>N</EmailAddressExists><RuleDataExists>N</RuleDataExists><LSVendorConfirmationExists>N</LSVendorConfirmationExists><AdditionalSrvcs>N</AdditionalSrvcs><ElectronicMiscDocumentList>N</ElectronicMiscDocumentList><TDSProfileExists>N</TDSProfileExists><ServiceInformationExists/><FiledFareDataExists/><VendorRemarksDataExists/><MembershipDataExists/><DividedBookingsExist>N</DividedBookingsExist><ClientFileReferencesExist/><CustomCheckRulesExist/><PassengerInformationExists/><GUID/><ARCNewPNR/><ARCFares/><ARCTicketed/><ARCSplitDivide/><ARCNameAdd/><ARCNameDelete/><ARCItinAdd/><ARCItinDEL/><ARCPhoneAdd/><ARCPhoneDel/><ARCFOPAdd/><ARCFOPDelete/><ARCSSRAdd/><ARCSSRDel/><ARCOSIAdd/><ARCOSIDel/><ReasonCodesspares/></GenPNRInfo></PNRBFRetrieve><AirSegSell><AirSell><DisplaySequenceNumber/><Vnd>xx</Vnd><FltNum>127</FltNum><OpSuf/><Class>C</Class><StartDt>20200520</StartDt><DtChg/><StartAirp>JFK</StartAirp><EndAirp>MNL</EndAirp><StartTm/><EndTm/><Status>GK</Status><NumPsgrs/><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>N</SuccessInd><COG/><TklessInd/><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><ErrText><Err/><KlrInErr/><InsertedTextAry></InsertedTextAry><Text>CK FRMT</Text></ErrText><AirSell><DisplaySequenceNumber/><Vnd>yy</Vnd><FltNum>127</FltNum><OpSuf/><Class>C</Class><StartDt>20200520</StartDt><DtChg/><StartAirp>JFK</StartAirp><EndAirp>MNL</EndAirp><StartTm/><EndTm/><Status>GK</Status><NumPsgrs/><SellType/><SellValidityPeriod/><MarriageNum/><SuccessInd>N</SuccessInd><COG/><TklessInd/><FareQuoteTkIgnInd/><StopoverInd/><AvailyBypassInd/><OpAirV/></AirSell><ErrText><Err/><KlrInErr/><InsertedTextAry></InsertedTextAry><Text>CK FRMT</Text></ErrText></AirSegSell></PNRBFManagement_51></SubmitXmlOnSessionResult></SubmitXmlOnSessionResponse></soapenv:Body></soapenv:Envelope>',
		output: {
			error: "Failed to sell 0xx127C20MAYJFKMNLGK1 - CK FRMT; Failed to sell 0yy127C20MAYJFKMNLGK1 - CK FRMT",
			reservation: {
				itinerary: [],
			},
			newAirSegments: [{
				"success": false,
				"displaySequenceNumber": "",
				"airline": "xx",
				"flightNumber": "127",
				"bookingClass": "C",
				"departureDate": {
					"raw": "20200520",
					"parsed": "2020-05-20",
				},
				"dayOffset": "",
				"departureAirport": "JFK",
				"destinationAirport": 'MNL',
				"departureTime": null,
				"destinationTime": null,
				"segmentStatus": "GK",
				"seatCount": "",
				"marriage": "",
				"aircraftChanges": false,
				"eticket": false,
				"isStopover": false,
				"operatedByCode": "",
				"messages": [],
			}, {
				"success": false,
				"displaySequenceNumber": "",
				"airline": "yy",
				"flightNumber": "127",
				"bookingClass": "C",
				"departureDate": {
					"raw": "20200520",
					"parsed": "2020-05-20",
				},
				"dayOffset": "",
				"departureAirport": "JFK",
				"destinationAirport": 'MNL',
				"departureTime": null,
				"destinationTime": null,
				"segmentStatus": "GK",
				"seatCount": "",
				"marriage": "",
				"aircraftChanges": false,
				"eticket": false,
				"isStopover": false,
				"operatedByCode": "",
				"messages": [],
			}],
		},
	});

	return list.map(a => [a]);
};


class TravelportClientTest extends require('../../Transpiled/Lib/TestCase') {
	async test_buildXml({input, output}) {
		this.assertSame(output, TravelportClient.buildPnrXmlDataObject(input));
	}

	async test_parseXml({input, output}) {
		this.assertArrayElementsSubset(output, await TravelportClient.parsePnrXmlResponse(input));
	}

	getTestMapping() {
		return [
			[provide_buildXml, this.test_buildXml],
			[provide_parseXml, this.test_parseXml],
		];
	}
}

module.exports = TravelportClientTest;