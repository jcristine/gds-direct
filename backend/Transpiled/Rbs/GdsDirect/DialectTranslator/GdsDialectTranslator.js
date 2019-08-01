

/**
 * GdsDialectTranslator::translate('apollo', 'sabre', 'A01MARRIXLAX');
 * ==> [
 *        'output' => '101MARRIXLAX',
 *        'translated' => true,
 *        'messages' => [],
 *        'errors' => [],
 *     ];
 */
const php = require('../../../phpDeprecated.js');
const PatternTranslator = require("./PatternTranslator");
const TranslateAvailabilityCmdAction = require("./TranslateAvailabilityCmdAction");
const TranslateTariffDisplayCmdAction = require("./TranslateTariffDisplayCmdAction");
const TranslatePricingCmdAction = require("./TranslatePricingCmdAction");
const TranslateAssignOrCancelSeat = require("./TranslateAssignOrCancelSeat");
const TranslateAddFrequentFlyerNumber = require("./TranslateAddFrequentFlyerNumber");
const TranslateChangeFrequentFlyerNumber = require("./TranslateChangeFrequentFlyerNumber");
const CommonDataHelper = require("../CommonDataHelper");

/** RAM cache */
const patternList = [
	// Area change
	{
		'apollo': 'S{single_char}',
		'galileo': 'S{single_char}',
		'sabre': '\u00A4{single_char}',
		'amadeus': 'JM{single_char}',
	},
	// Calculations
	{
		'apollo': '@LT{city}',
		'galileo': '@LT{city}',
		'sabre': 'T*{city}',
		'amadeus': 'DD{city}',
	},
	// Time at specified location
	{
		'apollo': ['XX{special_calculation}', 'XX {special_calculation}'],
		'galileo': ['XX{special_calculation}', 'XX {special_calculation}'],
		'sabre': 'T\u00A4{special_calculation}',
		'amadeus': 'DF{special_calculation}',
	},
	// Scroll down
	{
		'apollo': ['MR', 'MD'],
		'galileo': ['MR', 'MD'],
		'sabre': 'MD',
		'amadeus': 'MD',
	},
	//  Move up
	{
		'apollo': 'MU',
		'galileo': 'MU',
		'sabre': 'MU',
		'amadeus': 'MU',
	},
	//  Move to bottom
	{
		'apollo': 'MB',
		'galileo': 'MB',
		'sabre': 'MB',
		'amadeus': 'MB',
	},
	//  Move to top
	{
		'apollo': 'MT',
		'galileo': 'MT',
		'sabre': 'MT',
		'amadeus': 'MT',
	},
	// Increase seat count
	{
		'apollo': '+{number}',
		'galileo': '@A/{number}',
		'sabre': ',{number}',
	},
	// Air availability next screen
	{
		'apollo': 'A*',
		'galileo': 'A*',
		'sabre': '1*',
		'amadeus': 'MD',
	},
	// Air availability previous screen
	{
		'apollo': 'A-',
		'galileo': 'A*P',
		'sabre': '1*R',
		'amadeus': 'MU',
	},
	// Air availability original response (first screen)
	{
		'apollo': 'A*R',
		'galileo': 'A*O',
		'sabre': '1*OA',
		'amadeus': 'MO',
	},
	// Change air availability to future number of days
	{
		'apollo': 'A*+{int_num}',
		'galileo': 'A#{int_num}',
		'sabre': '1¥{int_num}',
		'amadeus': 'AC{int_num}',
	},
	// Air availability additional classes
	{
		'apollo': 'A*C{int_num}',
		'galileo': 'A@#{int_num}',
	},
	{
		'apollo': 'A*C{special_only_apollo_digit}',
		'galileo': 'A*R{special_only_apollo_digit}',
		'sabre': '1*C{special_only_apollo_digit}',
		'amadeus': 'AC{special_only_apollo_digit}',
	},
	// Air availability new date
	{
		'apollo': 'A*{date}',
		'galileo': 'A{date}',
		'sabre': '1{date}',
		'amadeus': 'AC{date}',
	},
	// Air availability change date and display return flight
	{
		'apollo': 'A*O{date}',
		'galileo': 'AR{date}',
		'sabre': '1R{date}',
		'amadeus': 'ACR{date}',
	},
	// Return availability to different day of same month
	{
		'sabre': '1R{int_num}',
		// following do not actually exist in the
		// GDS, they are aliases processed by us
		'apollo': 'A*O{int_num}',
		'galileo': 'AR{int_num}',
		'amadeus': 'A*O{int_num}',
	},
	//Air availability by city
	{
		'apollo': 'A*X{city}',
		'galileo': 'A.{city}',
		'sabre': '1{city}',
		'amadeus': 'AC/X{city}',
	},
	// Air availability departure city change
	{
		'apollo': 'A*B{city}',
		'galileo': 'AB{city}',
		'sabre': '1*D{city}',
		'amadeus': 'AC{city}',
	},
	// Air availability destination city change
	{
		'apollo': 'A*D{city}',
		'galileo': 'AO{city}',
		'sabre': '1*A{city}',
		'amadeus': 'AC//{city}',
	},
	// Air availability change multiple carrier
	{
		'apollo': 'A*{list_airlines_y}',
		'galileo': 'A{list_airlines_y}',
		'sabre': '1{list_airlines_y}',
		'amadeus': 'AC{list_airlines_y}',
	},
	// Air availability excluding airline
	{
		'apollo': 'A*-{al}',
		'galileo': 'A/{al}-',
		'sabre': '1¥*{al}',
		'amadeus': 'AC/A-{al}',
	},
	// Change air availability by time
	{
		'apollo': ['A*{time_short}', 'A*{time_short}M'],
		'galileo': 'A.{time_short}',
		'sabre': '1*{time_short}',
		'amadeus': 'AC{time_short}',
	},
	// Change air availability to future number of days
	{
		'apollo': 'A*+{int_num}',
		'galileo': 'A#{int_num}',
		'sabre': '1¥{int_num}',
		'amadeus': 'AC{int_num}',
	},
	// Change air availability to previous number of days
	{
		'apollo': 'A*-{int_num}',
		'galileo': 'A-{int_num}',
		'sabre': '1-{int_num}',
		'amadeus': 'AC-{int_num}',
	},
	// Air availability in airlines
	{
		'apollo': 'A*{list_airlines}',
		'galileo': 'A{list_airlines}',
		'sabre': '1{list_airlines}',
		'amadeus': 'AC{list_airlines}',
	},
	// Air availability not in airlines
	{
		'apollo': 'A*{list_not_in_airlines}',
		'galileo': 'A{list_not_in_airlines}-',
		'sabre': '1{list_not_in_airlines}',
		'amadeus': 'AC{list_not_in_airlines}',
	},
	// Change connection cities in availability
	{
		'apollo': 'A*X{city}{city}',
		'galileo': 'A.{city}.{city}',
		'sabre': '1{city}{city}',
		'amadeus': 'AC/X{city},{city}',
	},
	// Exclude connection city from availability
	{
		'apollo': 'A*X-{city}',
		'galileo': 'A.{city}-',
		'amadeus': 'AC/X-{city}',
	},
	// Exclude connection cities from availability
	{
		'apollo': 'A*X-{city}{city}',
		'galileo': 'A.{city}{city}-',
		'amadeus': 'AC/X-{city},{city}',
	},
	// More Inside availability
	{
		'apollo': 'L@{al}/A*',
		'galileo': 'AM*{al}',
		'amadeus': '1{al}MD',
	},
	// Rule display for selected tariff
	{
		'apollo': '$V{fare_num}',
		'galileo': 'FN*{fare_num}',
		'sabre': 'RD{fare_num}*M',
		'amadeus': 'FQN{fare_num}',
	},
	// Rule display for selected tariff
	{
		'apollo': '$V{fare_num}/{int_num}',
		'galileo': 'FN*{fare_num}/{int_num}',
		'sabre': 'RD{fare_num}*{int_num}',
		'amadeus': 'FQN{fare_num}*{int_num}',
	},
	// redisplay tariff display
	{
		'apollo': '$D',
		'galileo': 'FD*',
		'sabre': 'FQ*',
		'amadeus': 'MPFQD',
	},
	// change tariff display departure city
	{
		'apollo': '$DB{city}',
		'galileo': 'FDO{city}',
		'sabre': 'FQ*D{city}',
		'amadeus': null, // DOES NOT EXIST
	},
	// change tariff display destination city
	{
		'apollo': '$DD{city}',
		'galileo': 'FDD{city}',
		'sabre': 'FQ*A{city}',
		'amadeus': 'FQDC/{city}',
	},
	// Rule Summary - only in Apollo and Galileo
	{
		'apollo': '$V{fare_num}/S',
		'galileo': 'FN{fare_num}/S',
	},
	// Area change
	{
		'apollo': '$V{seg_num}',
		'sabre': '\u00A4{seg_num}',
	},
	// Routing Fare rules
	{
		'apollo': '$LR{fare_num}',
		'galileo': 'FR*{fare_num}',
		'sabre': 'RD{fare_num}*RTG',
		'amadeus': 'FQR{fare_num}',
	},
	// Show booking class needed
	{
		'apollo': '$LB{fare_num}/{al}',
		'galileo': 'FDC*{fare_num}//{al}',
		'sabre': 'RB{fare_num}{al}',
		'amadeus': 'FQS{fare_num}/A{al}',
	},
	// Show booking class needed (without airline)
	{
		'apollo': '$LB{fare_num}',
		'galileo': 'FDC*{fare_num}',
		'sabre': 'RB{fare_num}',
		'amadeus': 'FQS{fare_num}',
	},
	// Emulation to a new PCC
	{
		'apollo': 'SEM/{pcc}/AG',
		'galileo': 'SEM/{pcc}/AG',
		'sabre': 'AAA{pcc}',
		'amadeus': 'JUM/O-{pcc}',
	},
	// PNR search by Last Name and First Name  and Middle Name
	{
		'apollo': '**-{pax_last}/{pax_first} {pax_middle}',
		'sabre': '*-{pax_last}/{pax_first} {pax_middle}',
	},
	// PNR search by Last Name and First Name
	{
		'apollo': '**-{pax_last}/{pax_first}',
		'galileo': '*-{pax_last}/{pax_first}',
		'sabre': '*-{pax_last}/{pax_first}',
		'amadeus': 'RT/{pax_last}/{pax_first}',
	},
	// PNR search by Last Name
	{
		'apollo': '**-{pax_last}',
		'galileo': '*-{pax_last}',
		'sabre': '*-{pax_last}',
		'amadeus': 'RT/{pax_last}',
	},
	// PNR search by Last Name and First Name  and Middle Name
	{
		'apollo': '**B-{pax_last}/{pax_first} {pax_middle}',
		'galileo': '**B-{pax_last}/{pax_first} {pax_middle}',
		'sabre': '*-XXXX-{pax_last}/{pax_first} {pax_middle}',
	},
	// PNR search by Last Name and First Name through all PCC's
	{
		'apollo': '**B-{pax_last}/{pax_first}',
		'galileo': '**B-{pax_last}/{pax_first}',
		'sabre': '*-XXXX-{pax_last}/{pax_first}',
	},
	// PNR search by Last Name through all PCC's
	{
		'apollo': '**B-{pax_last}',
		'galileo': '**B-{pax_last}',
		'sabre': '*-XXXX-{pax_last}',
	},
	// PNR display by Record Locator
	{
		'apollo': ['*{pnr}', '* {pnr}'],
		'galileo': '*{pnr}',
		'sabre': '*{pnr}',
		'amadeus': 'RT{pnr}',
	},
	// PNR display from List
	{
		'apollo': '*{pnr_list}',
		'galileo': '*{pnr_list}',
		'sabre': '*{pnr_list}',
		'amadeus': 'RT{pnr_list}',
	},
	// Name field for adult
	{
		'apollo': 'N:{pax_last}/{pax_first}',
		'galileo': 'N.{pax_last}/{pax_first}',
		'sabre': '-{pax_last}/{pax_first}',
		'amadeus': 'NM1{pax_last}/{pax_first}',
	},
	// Name field for adult with middle name
	{
		'apollo': 'N:{pax_last}/{pax_first} {pax_middle}',
		'galileo': 'N.{pax_last}/{pax_first} {pax_middle}',
		'sabre': '-{pax_last}/{pax_first} {pax_middle}',
		'amadeus': 'NM1{pax_last}/{pax_first} {pax_middle}',
	},
	// Name field for child
	{
		'apollo': 'N:{pax_last}/{pax_first}*P-{pax_type}',
		'galileo': 'N.{pax_last}/{pax_first}*P-{pax_type}',
		'sabre': [
			'-{pax_last}/{pax_first}*P-{pax_type}',
			'-{pax_last}/{pax_first}*{pax_type}',
		],
		'amadeus': [
			'NM1{pax_last}/{pax_first} ({pax_type})',
			'NM1{pax_last}/{pax_first}({pax_type})',
		],
	},
	// Name field for child with middle name
	{
		'apollo': 'N:{pax_last}/{pax_first} {pax_middle}*P-{pax_type}',
		'galileo': 'N.{pax_last}/{pax_first} {pax_middle}*P-{pax_type}',
		'sabre': [
			'-{pax_last}/{pax_first} {pax_middle}*P-{int_num}',
			'-{pax_last}/{pax_first} {pax_middle}*{pax_type}',
		],
		'amadeus': 'NM1{pax_last}/{pax_first} {pax_middle} ({pax_type})',
	},
	// Name field for infant
	{
		'apollo': 'N:I/{pax_last}/{pax_first}*{pax_dob}',
		'galileo': 'N.I/{pax_last}/{pax_first}*{pax_dob}',
		'sabre': [
			'-I/{pax_last}/{pax_first}*DOB{pax_dob}',
			'-I/{pax_last}/{pax_first}*{pax_dob}',
		],
		'amadeus': [
			'1/(INF{pax_last}/{pax_first}/{pax_dob})',
			'1/(INF {pax_last}/{pax_first}/{pax_dob})',
		],
	},
	// Name field for infant with middle name
	{
		'apollo': 'N:I/{pax_last}/{pax_first} {pax_middle}*{pax_dob}',
		'galileo': 'N.I/{pax_last}/{pax_first} {pax_middle}*{pax_dob}',
		'sabre': [
			'-I/{pax_last}/{pax_first} {pax_middle}*DOB{pax_dob}',
			'-I/{pax_last}/{pax_first} {pax_middle}*{pax_dob}',
		],
		'amadeus': '1/(INF{pax_last}/{pax_first} {pax_middle}/{pax_dob})',
	},
	// Add ticketing field
	{
		'apollo': 'T:TAU/{date}',
		'galileo': 'T.TAU/{date}',
		'sabre': '7TAW/{date}',
		'amadeus': 'TKTL{date}',
	},
	// Change ticketing field
	{
		'apollo': 'C:T:TAU/{date}',
		'galileo': 'T.@TAU/{date}',
		'sabre': '7\u00A4TAW{date}/',
		'amadeus': '5/TL{date}',
	},
	// Change ticketing field
	{
		'apollo': 'C:T:',
		'galileo': 'T.@',
		'sabre': ['7\u00A4', '71\u00A4'],
	},
	// Change/Delete name
	{
		'apollo': 'C:{pax_num}N:{free_text}',
		'galileo': 'N.P{pax_num}@{free_text}',
		'sabre': '-{pax_num}\u00A4{free_text}',
		'amadeus': null, // NON-TRANSLATABLE
	},
	// Delete Received
	{
		'apollo': 'C:R:',
		'galileo': 'R.@',
		'sabre': '6\u00A4',
		'amadeus': null, // NON-TRANSLATABLE
	},
	// Add receiving field
	{
		'apollo': 'R:{agent_name}',
		'galileo': 'R.{agent_name}',
		'sabre': '6{agent_name}',
		'amadeus': [
			'RF {agent_name}',
			'RF{agent_name}',
		],
	},
	// End Transaction
	{
		'apollo': 'ER',
		'galileo': 'ER',
		'sabre': 'ER',
		'amadeus': 'ER',
	},
	// TSA Remarks
	{
		'apollo': '@:3SSRDOCSYYHK1/N{special_pax_order}/////{pax_dob}/{pax_gender}//{pax_last}/{pax_first}',
		'galileo': 'SI.P{special_pax_order}/SSRDOCSYYHK1/////{pax_dob}/{pax_gender}//{pax_last}/{pax_first}',
		'sabre': '3DOCSA/DB/{pax_dob}/{pax_gender}/{pax_last}/{pax_first}-{special_pax_order}',
		'amadeus': 'SRDOCSYYHK1-----{pax_dob}-{pax_gender}--{pax_last}-{pax_first}/P{special_pax_order}',
	},
	// TSA Remarks for infant
	{
		'apollo': '@:3SSRDOCSYYHK1/N{special_pax_order}/////{pax_dob}/{pax_gender}I//{pax_last}/{pax_first}',
		'sabre': '3DOCSA/DB/{pax_dob}/{pax_gender}I/{pax_last}/{pax_first}-{special_pax_order}',
		'amadeus': 'SRDOCSYYHK1-----{pax_dob}-{pax_gender}I--{pax_last}-{pax_first}/P{special_pax_order}',
	},
	// Add "ASAP CUSTOMER SUPPORT"
	{
		'sabre': ['9{agency_phone}-A', '91-{agency_phone}-A'],
		'galileo': 'P.SFOT*{agency_phone} ASAP CUSTOMER SUPPORT',
		'amadeus': 'AP SFO {agency_phone}-A',
	},
	{
		'sabre': ['9{agency_phone}-H', '91-{agency_phone}-H'],
		'galileo': 'P.SFOH*{agency_phone} ASAP CUSTOMER SUPPORT',
		'amadeus': 'AP SFO {agency_phone}-H',
	},
	// Agency Phone SFO number field 1
	{
		'apollo': 'P:SFOAS/{free_text}',
		'galileo': 'P.SFOT*{free_text}',
	},
	// Agency Phone SFO number field 2
	{
		'apollo': 'P:SFOR/{free_text}',
		'galileo': 'P.SFOH*{free_text}',
	},
	// Agency Phone number field
	{
		'apollo': 'P:{special_agency_location}AS/{agency_phone}{special_agency_free_text}',
		'galileo': 'P.{special_agency_location}T*{agency_phone}{special_agency_free_text}',
		'sabre': [
			'91-{agency_phone}-A{special_agency_location}{special_agency_free_text}',
			'91-{agency_phone}{special_agency_location}{special_agency_free_text}',
		],
		'amadeus': 'AP {special_agency_location} {agency_phone}-A{special_agency_free_text}',
	},
	// Agency Phone number field
	{
		'apollo': 'P:{special_agency_location}R/{agency_phone}{special_agency_free_text}',
		'galileo': 'P.{special_agency_location}H*{agency_phone}{special_agency_free_text}',
		'sabre': '91-{agency_phone}-H{special_agency_location}{special_agency_free_text}',
		'amadeus': 'AP {special_agency_location} {agency_phone}-H{special_agency_free_text}',
	},
	// Display E-tkts in PNR
	{
		'apollo': '*HTE',
		'galileo': '*HTE',
		'sabre': '*T',
		'amadeus': 'TWD',
	},
	// Display ticket number info
	{
		'apollo': '*TE{int_num}',
		'galileo': '*TE{int_num}',
		'sabre': 'WETR*{int_num}',
		'amadeus': 'TWD/L{int_num}',
	},
	// Display ticket number info
	{
		'apollo': '*TE/{special_ticket_num}',
		'galileo': '*TE/{special_ticket_num}',
		'sabre': 'WETR*T{special_ticket_num}',
		'amadeus': 'TWD/{special_ticket_num}',
	},
	// Display stored fare
	{
		'apollo': '*LF',
		'galileo': '*FF',
		'sabre': '*PQ',
		'amadeus': 'TQT',
	},
	// Display stored fare
	{
		'apollo': '*LF{int_num}',
		'galileo': '*FF{int_num}',
		'sabre': '*PQ{int_num}',
		'amadeus': 'TQT/T{int_num}',
	},
	// Delete stored fare
	{
		'apollo': 'XT',
		'galileo': 'FXALL',
		'sabre': 'PQD-ALL',
		'amadeus': 'TTE/ALL',
	},
	// Delete stored fare
	{
		'apollo': 'XT{int_num}',
		'galileo': 'FX{int_num}',
		'sabre': 'PQD{int_num}',
		'amadeus': 'TTE/T{int_num}',
	},
	// Confirm waitlist
	{
		'apollo': '.IHK',
		'galileo': '@ALL',
		'sabre': '.IHK',//no this command in sabre,
		'amadeus': 'ERK',
	},
	// Change segment status
	{
		'apollo': '.{seg_num}{ss}',
		'galileo': '@{seg_num}{ss}',
		'sabre': '.{seg_num}{ss}',
		'amadeus': '{seg_num}/{ss}',
	},
	// Price remarks
	{
		'apollo': '@:5S{pax_order} {sell_price} N1 {net_price} F1 {fare_amount}',
		'sabre': '5S{pax_order} {sell_price} N1 {net_price} F1 {fare_amount}',
		'amadeus': 'RMS{pax_order} {sell_price} N1 {net_price} F1 {fare_amount}',
	},
	// Delete Remark
	{
		'apollo': 'C:{range}@:5{free_text}',
		'galileo': 'NP.{range}@{free_text}',
		'sabre': '5{range}\u00A4{free_text}',
		//'amadeus' => 'XE{range}{free_text}', // translatable only in one direction
		'amadeus': null,
	},
	// Free text
	{
		'apollo': '@:5{free_text_no_at}',
		'galileo': 'NP.{free_text_no_at}',
		'sabre': '5{free_text_no_at}',
		'amadeus': 'RM{free_text_no_at}',
	},
	// Free text
	{
		'apollo': 'PS-{free_text}',
		'amadeus': 'UHP/{free_text}',
	},
	// Price remarks
	{
		'apollo': '@:5S{free_text}',
		'sabre': '5S{free_text}',
		'amadeus': 'RMS{free_text}',
	},
	// Retention line
	{
		'apollo': '0TURZZBK1SFO{date}-{free_text}',
		'galileo': '0TURZZBK1SFO{date}-{free_text}',
		'sabre': '0OTHYYGK1/{free_text}{date}',
		'amadeus': 'RU1AHK1SFO{date}/{free_text}',
	},
	// Find new itinerary with lower fares
	{
		'apollo': 'FS',
		'galileo': 'FS',
		'sabre': 'WPNI',
		'amadeus': 'FXD',
	},
	// Redisplay Low Fare Search
	{
		'apollo': '*FS',
		'galileo': 'FS*',
		'sabre': 'WPNI*',
		'amadeus': 'MPFXD',
	},
	// Find better fare for business class
	{
		'apollo': 'FS{special_class_types_lib}',
		'sabre': 'WPNI{special_class_types_lib}',
	},
	// Regardless of availability
	{
		'apollo': 'FSA',
		'galileo': 'FSA',
		'sabre': 'WPNIS',
	},
	// Choose option to book from display
	{
		'apollo': 'FS{fare_num}',
		'galileo': 'FSK{fare_num}',
		'sabre': 'WC¥{fare_num}X',
		'amadeus': 'FXZ{fare_num}',
	},
	// Find lowest itineraries with direct flights
	{
		'apollo': 'FS//D',
		'galileo': 'FS++.D',
		'sabre': 'WPNI/D',
		'amadeus': 'FXD//FD',
	},
	// Find better fare with specific alliance: A,S,O
	{
		'apollo': 'FS//+/*{single_char}',
		'galileo': 'FS++//*{single_char}',
		'sabre': 'WPNI/A*{single_char}',
		'amadeus': 'FXD//A*{single_char}',
	},
	// Find better fares, X days earlier than current itinerary
	{
		'apollo': 'FS//-{int_num}',
		'galileo': 'FS++-{int_num}',
		'sabre': 'WPNI¥M{int_num}',
		'amadeus': 'FXD//D-{int_num}',
	},
	// Find better fares, X days later than current itinerary
	{
		'apollo': 'FS//+{int_num}',
		'galileo': 'FS++#{int_num}',
		'sabre': 'WPNI¥P{int_num}',
		'amadeus': 'FXD//D{int_num}',
	},
	// Find better fares with time range comparing to current itinerary
	{
		'apollo': 'FS//D{int_num}',
		'sabre': 'WPNI/T{int_num}',
		// amadeus/galileo: NON-TRANSLATABLE
	},
	// Find better fares and change currency
	{
		'apollo': 'FS:{currency}',
		'galileo': 'FS:{currency}',
		'sabre': 'WPNI¥M{currency}',
		'amadeus': 'FXD/R,FC-{currency}',
	},
	// Find lowest itineraries for specific airlines
	{
		'apollo': 'FS//{list_airlines_fs}',
		'galileo': 'FS++{list_airlines_fs}',
		'sabre': 'WPNI/A{list_airlines_fs}',
		'amadeus': 'FXD/{list_airlines_fs}',
	},
	// Find lowest itinerarie for specific segments
	{
		'apollo': 'FSS{special_rebook_segment_numbers}',
		'galileo': 'FS+S{special_rebook_segment_numbers}',
		'sabre': 'WPNI¥S{special_rebook_segment_numbers}',
		'amadeus': 'FXD/S{special_rebook_segment_numbers}',
	},
	// Find new itinerary for PTC
	{
		'apollo': 'FS//*{ptc}',
		'galileo': 'FS+*{ptc}',
		'sabre': 'WPNI¥P{ptc}',
		'amadeus': 'FXD/R{ptc}',
	},
	// Find new itinerary with lower fares with the same connecting cities
	{
		'apollo': null, // DOES NOT EXIST
		'galileo': 'FS++I',
		'sabre': 'WPNIX',
		'amadeus': 'FXD//X',
	},
	// Find better fare for business class
	{
		'apollo': 'FS//@C',
		'galileo': 'FS++-BUSNS',
		'sabre': 'WPNI¥TC-BB',
		'amadeus': 'FXD//KC',
	},
	// Find better fare for first class
	{
		'apollo': 'FS//@F',
		'galileo': 'FS++-FIRST',
		'sabre': 'WPNI¥TC-FB',
		'amadeus': 'FXD//KF',
	},
	// Find better fare for economy class
	{
		'apollo': 'FS//@Y',
		'galileo': 'FS++-ECON',
		'sabre': 'WPNI¥TC-YB',
		'amadeus': 'FXD//KM',
	},
	// Find better fare for premium economy class
	{
		'apollo': 'FS//@W',
		'galileo': 'FS++-PREME',
		'sabre': 'WPNI¥TC-SB',
		'amadeus': 'FXD//KY',
	},
	// Find better fare for premium first class
	{
		'apollo': 'FS//@P',
		'galileo': 'FS++-PREMF',
		'sabre': 'WPNI¥TC-PB',
		'amadeus': null, // DOES NOT EXIST
	},
	// FS without PNR
	{
		'apollo': 'FS{city}{date}{city}',
		'galileo': 'FS{city}{date}{city}',
		'sabre': 'JR.{city}/S-OY{city}{date}',
		'amadeus': 'FXD{city}/D{date}{city}',
	},
	// FS round-trip
	{
		'apollo': 'FS{city}{date}{city}{date}{city}',
		'galileo': 'FS{city}{date}{city}{date}{city}',
		'amadeus': 'FXD{city}/D{date}{city}/D{date}{city}',
		'sabre': null, // Sabre only allows specifying cabin class explicitly
	},
	// FS multi-leg
	{
		'apollo': 'FS{city}{date}{city}{date}{city}{date}{city}',
		'galileo': 'FS{city}{date}{city}{date}{city}{date}{city}',
		'sabre': 'JR.{city}/S-OY{city}{date}/S-OY{city}{date}/S-OY{city}{date}',
		'amadeus': 'FXD{city}/D{date}{city}/D{date}{city}/D{date}{city}',
	},
	// FS with party size
	{
		'apollo': 'FS{int_num}{city}{date}{city}',
		'galileo': 'FS{int_num}{city}{date}{city}',
		'sabre': 'JR.{city}/S-OY{city}{date}/P-{int_num}ADT',
		'amadeus': 'FXD{int_num}{city}/D{date}{city}',
	},
	// FS with party size
	{
		'apollo': 'FS{int_num}{city}{date}{city}',
		'galileo': 'FS{int_num}{city}{date}{city}',
		'sabre': 'JR.{city}/S-OY{city}{date}/P-{int_num}ADT',
		'amadeus': 'FXD{int_num}{city}/D{date}{city}',
	},
	// FS direct round-trip
	{
		'apollo': 'FS{city}{date}{city}{date}{city}//D',
		'galileo': 'FS{city}{date}{city}{date}{city}++.D',
		'sabre': 'JR.{city}/S-OY{city}{date}/S-OY{city}{date}/K-0',
		'amadeus': 'FXD{city}/D{date}{city}/D{date}{city}//FN',
	},
	// FS RT itineraries for a specific dates, city pairs and airlines
	{
		'apollo': 'FS{city}{date}{city}{date}{city}//{list_airlines_fs}',
		'galileo': 'FS{city}{date}{city}{date}{city}++{list_airlines_fs}',
		'sabre': 'JR.{city}/S-OY{city}{date}{list_airlines_fs}/S-OY{city}{date}{list_airlines_fs}',
		'amadeus': 'FXD{city}/D{date}{city}/D{date}{city}/{list_airlines_fs}',
	},
	// FS round-trip specify alliance
	{
		'apollo': 'FS{city}{date}{city}{date}{city}//+/*{single_char}',
		'galileo': 'FS{city}{date}{city}{date}{city}++//*{single_char}',
		'sabre': 'JR.{city}/S-OY{city}{date}*{single_char}/S-OY{city}{date}*{single_char}',
		'amadeus': 'FXD{city}/D{date}{city}/D{date}{city}//A*{single_char}',
	},
	// FS round-trip business class
	{
		'apollo': 'FS{city}{date}{city}{date}{city}//@C',
		'galileo': 'FS{city}{date}{city}{date}{city}++-BUSNS',
		'sabre': 'JR.{city}/S-OC{city}{date}/S-OC{city}{date}',
		'amadeus': 'FXD{city}/D{date}{city}/D{date}{city}//KC',
	},
	// FS round-trip first class
	{
		'apollo': 'FS{city}{date}{city}{date}{city}//@F',
		'galileo': 'FS{city}{date}{city}{date}{city}++-FIRST',
		'sabre': 'JR.{city}/S-OF{city}{date}/S-OF{city}{date}',
		'amadeus': 'FXD{city}/D{date}{city}/D{date}{city}//KF',
	},
	// FS round-trip economy class
	{
		'apollo': ['FS{city}{date}{city}{date}{city}//@Y', 'FS{city}{date}{city}{date}{city}'],
		'galileo': ['FS{city}{date}{city}{date}{city}++-ECON', 'FS{city}{date}{city}{date}{city}'],
		'sabre': 'JR.{city}/S-OY{city}{date}/S-OY{city}{date}',
		'amadeus': ['FXD{city}/D{date}{city}/D{date}{city}//KM', 'FXD{city}/D{date}{city}/D{date}{city}'],
	},
	// FS round-trip premium economy class
	{
		'apollo': 'FS{city}{date}{city}{date}{city}//@W',
		'galileo': 'FS{city}{date}{city}{date}{city}++-PREME',
		'sabre': 'JR.{city}/S-OS{city}{date}/S-OS{city}{date}',
		'amadeus': 'FXD{city}/D{date}{city}/D{date}{city}//KY',
	},
	// FS round-trip premium first class
	{
		'apollo': 'FS{city}{date}{city}{date}{city}//@P',
		'galileo': 'FS{city}{date}{city}{date}{city}++-PREMF',
		'sabre': 'JR.{city}/S-OP{city}{date}/S-OP{city}{date}',
		'amadeus': null, // DOES NOT EXIST
	},
	// Refresh and show itinerary
	{
		'apollo': ['*R', '*R'],
		'galileo': '*R',
		'sabre': '*R',
		'amadeus': 'RT',
	},
	// Replace segments from availability
	{
		'apollo': 'X{special_rebook_segment_numbers}/0{number}{class_list}{star}',
		'galileo': 'X{special_rebook_segment_numbers}+0{number}{class_list}{star}',
		'sabre': 'X{special_rebook_segment_numbers}¥0{number}{class_list}{star}',
	},
	// Delete Single Segment
	{
		'apollo': 'X{special_rebook_segment_numbers}',
		'galileo': 'X{special_rebook_segment_numbers}',
		'sabre': 'X{special_rebook_segment_numbers}',
		'amadeus': 'XE{special_rebook_segment_numbers}',
	},
	// Rebook segments with one class
	{
		'apollo': 'X{special_rebook_one_class}',
		'galileo': '@{special_rebook_one_class}',
		'sabre': 'WC{special_rebook_one_class}',
		'amadeus': 'SB{special_rebook_one_class}',
	},
	// Multiple segments Booking Class Rebook
	{
		'apollo': 'X{special_classes_rebook}',
		'sabre': 'WC{special_classes_rebook}',
		'amadeus': 'SB{special_classes_rebook}',
	},
	// Itinerary booking class rebook
	{
		'apollo': 'XA/0{class}',
		'galileo': '@A/{class}',
		'sabre': 'WCA{class}',
		'amadeus': 'SB{class}',
	},
	// Segment Booking Class Rebook
	{
		'apollo': 'X{seg_num}/0{class}',
		'galileo': '@{seg_num}/{class}',
		'sabre': 'WC{seg_num}{class}',
		'amadeus': 'SB{class}{seg_num}',
	},
	// Multiple segments Booking Class Rebook
	{
		'apollo': 'X{seg_num}-{seg_num}/0{class}',
		'galileo': '@{seg_num}-{seg_num}/{class}',
		'sabre': 'WC{seg_num}-{seg_num}{class}',
		'amadeus': 'SB{class}{seg_num}-{seg_num}',
	},

	// Single Segment Date Rebook
	{
		'apollo': 'X{seg_num}/0{date}',
		'galileo': '@{seg_num}/{date}',
		'sabre': 'X{seg_num}¥00{date}',
		'amadeus': 'SB{date}{seg_num}',
	},
	// Multiple Segments Date Rebook
	{
		'apollo': 'X{seg_num}-{seg_num}/0{date}',
		'galileo': '@{seg_num}-{seg_num}/{date}',
		'sabre': 'X{seg_num}-{seg_num}¥00{date}',
		'amadeus': 'SB{date}{seg_num},{seg_num}',
	},
	// Delete TSA
	{
		'apollo': 'C:{tsa_order}-{tsa_order}@:3',
		'galileo': 'SI.{tsa_order}-{tsa_order}@',
		'sabre': '3{tsa_order}-{tsa_order}\u00A4',
		'amadeus': 'XE{tsa_order}-{tsa_order}',
	},
	// Segment Move
	{
		'apollo': '/{special_segment_move_numbers}',
		'galileo': '/{special_segment_move_numbers}',
		'sabre': '/{special_segment_move_numbers}',
		'amadeus': 'RS{special_segment_move_numbers}',
	},
	// Selling segments all together with repeat
	{
		'apollo': '0{pax_num}{class}{seg_num}*',
		'galileo': '0{pax_num}{class}{seg_num}*',
		'sabre': '0{pax_num}{class}{seg_num}*',
		'amadeus': 'SS{pax_num}{class}{seg_num}',
	},
	// Selling one segment
	{
		'apollo': '0{pax_num}{class}{seg_num}',
		'galileo': '0{pax_num}{class}{seg_num}',
		'sabre': '0{pax_num}{class}{seg_num}',
		'amadeus': 'SS{pax_num}{class}{seg_num}',
	},
	// Selling segments with segment status
	{
		'apollo': '0{pax_num}{class}{number}*{special_ss_pax_comment}',
		'galileo': '0{pax_num}{class}{number}{special_ss_pax_comment}*',
		'sabre': '0{pax_num}{class}{number}{special_ss_pax_comment}*',
		'amadeus': 'SS{pax_num}{class}{number}/{special_ss_pax_comment}',
	},
	// Selling segments with segment status
	{
		'apollo': '0{pax_num}{class}{number}{special_ss_pax_comment}',
		'galileo': '0{pax_num}{class}{number}{special_ss_pax_comment}',
		'sabre': '0{pax_num}{class}{number}{special_ss_pax_comment}',
		'amadeus': 'SS{pax_num}{class}{number}/{special_ss_pax_comment}',
	},
	// Selling segments one by one
	{
		'apollo': '0{pax_num}{special_classes}{special_ss_pax_comment}',
		'galileo': '0{pax_num}{special_classes}{special_ss_pax_comment}',
		'sabre': '0{pax_num}{special_classes}{special_ss_pax_comment}',
		'amadeus': 'SS{pax_num}{special_classes}/{special_ss_pax_comment}',
	},
	// Direct Sell
	{
		'apollo': '0{al}{flight_num}{class}{date}{city_pair}{special_ss_pax_comment}',
		'galileo': '0{al}{flight_num}{class}{date}{city_pair}{special_ss_pax_comment}',
		'sabre': '0{al}{flight_num}{class}{date}{city_pair}{special_ss_pax_comment}',
		'amadeus': 'SS{al}{flight_num}{class}{date}{city_pair}{special_ss_pax_comment}',
	},
	// Selling segments one by one
	{
		'apollo': '0{pax_num}{special_classes}',
		'galileo': '0{pax_num}{special_classes}',
		'sabre': '0{pax_num}{special_classes}',
		'amadeus': 'SS{pax_num}{special_classes}',
	},
	// Decode country code
	{
		'apollo': 'S*COU/{country}',
		'galileo': '.LD {country}',
		'sabre': 'HCCC/{country}',
		'amadeus': 'DC{country}',
	},
	// Encode country code
	{
		'apollo': 'S*COU/{text}',
		'galileo': '.LE {text}',
		'sabre': 'HCCC/{text}',
		'amadeus': 'DC{text}',
	},
	// Decode airport code
	{
		'apollo': [
			'S*CTY/{city}',
			'S*CITY/{city}',
			'S*CTY.{city}',
		],
		'galileo': '.CD {city}',
		'sabre': 'W/*{city}',
		'amadeus': 'DAC{city}',
	},
	// Decode city
	{
		'apollo': [
			'S*CTY/{text}',
			'S*CITY/{text}',
			'S*CTY.{text}',
		],
		'galileo': '.CE {text}',
		'sabre': 'W/-CC{text}',
		'amadeus': 'DAN{text}',
	},
	// Decode airline code
	{
		'apollo': 'S*AIR/{al}',
		'galileo': '.AD {al}',
		'sabre': 'W/*{al}',
		'amadeus': 'DNA{al}',
	},
	// Encode airline
	{
		'apollo': [
			'S*AIR/{text}',
			'S*AIRL/{text}',
			'S*AIR.{text}',
		],
		'galileo': '.AE {text}',
		'sabre': 'W/-AL{text}',
		'amadeus': 'DNA{text}',
	},
	// Decode Airplane Type
	{
		'apollo': 'HELP {flt_type}',
		'galileo': '.EE {flt_type}',
		'sabre': 'W/EQ*{flt_type}',
		'amadeus': 'DNE{flt_type}',
	},
	// Help Availability
	{
		'apollo': 'HELP $D',
		'galileo': 'HELP FD',
		'sabre': 'FQHELP',
		'amadeus': 'HE FQD',
	},
	// Help that should not be translated, since PRICE is an alias
	{
		'apollo': 'HELP PRICE',
		'sabre': 'HELP PRICE',
	},
	// Help
	{
		'apollo': 'HELP {text}',
		'galileo': 'HELP {text}',
		'sabre': '{text}HELP',
		'amadeus': 'HE {text}',
	},
	// What PCC i'm in?
	{
		'apollo': 'OP/W*',
		'galileo': 'OP/W*',
		'sabre': '*S*',
		'amadeus': 'JD',
	},
	// Flight information
	{
		'apollo': '*SVC',
		'galileo': '*SVC',
		'sabre': 'VI*',
		'amadeus': 'RTSVC',
	},
	// Display assigned seats
	{
		'apollo': '9D',
		'galileo': '*SD',
		'sabre': '*B',
		'amadeus': 'RTSTR',
	},
	{
		'apollo': '9D/S{int_num}',
		'galileo': 'SM*S{int_num}',
		'sabre': '*B{int_num}',
		'amadeus': 'RTSTR/S{int_num}',
	},
	// View seat map
	{
		'apollo': '9V/S{int_num}',
		'galileo': 'SA*S{int_num}',
		'sabre': '4G{int_num}*',
		'amadeus': 'SM{int_num}',
	},
	// View seat map without pnr
	{
		'apollo': '9V/{al}{flt_num}{class}{date}{city_pair}',
		'galileo': 'SM*{al}{flt_num}{class}{date}{city_pair}',
		'sabre': '4G*{al}{flt_num}{class}{date}{city_pair}',
		'amadeus': 'SM{al}{flt_num}/{class}/{date}{city_pair}',
	},
	// Ignore
	{
		'apollo': ['!aliasDoubleIgnore', 'I'],
		'galileo': 'I',
		'sabre': 'I',
		'amadeus': 'IG',
	},
	// Ignore and retrieve
	{
		'apollo': 'IR',
		'galileo': 'IR',
		'sabre': 'IR',
		'amadeus': 'IR',
	},
	// Display only names
	{
		'apollo': '*N',
		'galileo': '*N',
		'sabre': '*N',
		'amadeus': 'RTN',
	},
	// Refresh and show itinerary, air segments only
	{
		'apollo': '*IA',
		'galileo': '*IA',
		'sabre': '*IA',
		'amadeus': 'RTI',
	},
	// Whole history
	{
		'apollo': '*H',
		'galileo': '*H',
		'sabre': '*H',
		'amadeus': 'RH',
	},
	// PNR Air Segments History
	{
		'apollo': '*HA',
		'galileo': '*HIA',
		'sabre': '*HIA',
		'amadeus': 'RHA',
	},
	// PNR Itinerary Segments History
	{
		'apollo': '*HI',
		'galileo': '*HI',
		'sabre': '*HI',
		'amadeus': 'RHI',
	},
	// Historical (3 days) flight info
	{
		'apollo': 'F:{al}{flight_num}/{date}',
		'sabre': '2{al}{flight_num}/{date}',
		'amadeus': 'DO{al}{flight_num}/{date}',
		'galileo': 'L@{al}/LF{al}{flight_num}/{date}',
	},
	// Flight route info
	{
		'apollo': 'VIT{al}{flight_num}/{date}',
		'galileo': 'TT{al}{flight_num}/{date}',
		'sabre': 'V*{al}{flight_num}/{date}',
		// DO is not exactly the same as VIT, but is close enough (see previous cmd)
		'amadeus': 'DO{al}{flight_num}/{date}',
	},
	// Minimum Connection Time
	{
		'apollo': '@MT',
		'galileo': '@MT',
		'sabre': 'VCT*',
		'amadeus': 'DMI',
	},
	// rebook after Best Buy - Apollo/Galileo specific
	{
		'apollo': ['$BBQ01', '$BB0'],
		'galileo': 'FQBBK',
		'sabre': 'WPNCB',
		'amadeus': 'FXR',
	},
	// Display Frequent Flyer Number
	{
		'apollo': '*MP',
		'sabre': '*FF',
		'amadeus': 'NON-TRANSLATABLE',
		'galileo': '*MM',
	},
];

class GdsDialectTranslator
{
	constructor() {
		this.$baseDate = null;
	}

	setBaseDate($baseDate)  {

		this.$baseDate = $baseDate;
		return this;
	}

	static getPatternList()  {
		return patternList;
	}

	translateThroughSeparateFunctions($fromGds, $toGds, $userInput)  {
		let $result, $parsed;

		$result = null;
		$parsed = CommonDataHelper.parseCmdByGds($fromGds, $userInput);
		if (TranslateAvailabilityCmdAction.isAvailabilityCommand($userInput, $fromGds)) {
			$result = TranslateAvailabilityCmdAction.translate($userInput, $fromGds, $toGds);
		} else if (TranslateTariffDisplayCmdAction.isTariffDisplayCommand($userInput, $fromGds)) {
			$result = TranslateTariffDisplayCmdAction.translate($userInput, $fromGds, $toGds);
		} else if ($parsed.data) {
			if ($parsed['type'] === 'addFrequentFlyerNumber') {
				$result = TranslateAddFrequentFlyerNumber.translate($parsed['data'], $fromGds, $toGds);
			} else if ($parsed['type'] === 'changeFrequentFlyerNumber') {
				$result = TranslateChangeFrequentFlyerNumber.translate($parsed['data'], $fromGds, $toGds);
			} else if (['requestSeats', 'cancelSeats'].includes($parsed['type'])) {
				$result = TranslateAssignOrCancelSeat.translate($parsed, $fromGds, $toGds);
			} else if (['priceItinerary', 'storePricing'].includes($parsed['type'])) {
				$result = (new TranslatePricingCmdAction()).setBaseDate(this.$baseDate).translate($userInput, $fromGds, $toGds, $parsed);
			}
		}
		if (!php.empty($result)) {
			return PatternTranslator.formatOutput($result, $toGds);
		} else {
			return null;
		}
	}

	static translateThroughPatterns($fromGds, $toGds, $userInput)  {
		let $messages, $notTranslatedPattern, $patternData, $result;

		$messages = [];
		$notTranslatedPattern = false;

		$userInput = PatternTranslator.preformatInput($userInput, $fromGds);
		for ($patternData of Object.values(this.getPatternList())) {
			if (php.empty($patternData[$fromGds]) ||
                php.empty($patternData[$toGds]) ||
                !PatternTranslator.prefixMatches($patternData[$fromGds], $userInput)
			) {
				continue;
			}
			$result = PatternTranslator.translatePattern($userInput, $fromGds, $toGds, $patternData[$fromGds], $patternData[$toGds]);
			if ($result['translated'] == true) {
				if (!php.empty($result['error']) && $result['error'] == 'empty destination pattern') {
					$notTranslatedPattern = true;
					continue;
				} else {
					return {
						'output': $result['output'],
						'messages': $messages,
					};
				}
			}
		}

		if ($notTranslatedPattern) {
			$messages.push(php.strtoupper('Command is not available in '+$toGds));
		}
		return {
			'output': null,
			'messages': $messages,
		};
	}

	// '$D10MAYKIVRIX/MDA' -> '$D10MAYKIVRIX', '/MDA'
	static removeAliasModifiers($userInput)  {
		let $matches, $_, $aliasMods;

		if (php.preg_match(/^(\S.*?)((\/MDA\d*|\/MIX)+)$/, $userInput, $matches = [])) {
			[$_, $userInput, $aliasMods] = $matches;
		} else {
			$aliasMods = '';
		}
		return [$userInput, $aliasMods];
	}

	static returnAliasModifiers($resultCmd, $aliasMods)  {
		if (!$resultCmd) {
			return null;
		} else {
			return $resultCmd+$aliasMods;
		}
	}

	translate($fromGds, $toGds, $userInput)  {
		let $errors, $messages, $output, $aliasMods, $result;

		$errors = [];
		$messages = [];
		$output = null;

		if ($fromGds == $toGds) {
			$output = $userInput;
		} else if (php.empty($userInput)) {
			$errors.push('Command is empty');
			$messages.push('ERROR! COMMAND IS EMPTY');
		} else {
			[$userInput, $aliasMods] = this.constructor.removeAliasModifiers($userInput);
			$output = this.translateThroughSeparateFunctions($fromGds, $toGds, $userInput);
			if (php.empty($output)) {
				$result = this.constructor.translateThroughPatterns($fromGds, $toGds, $userInput);
				$output = $result['output'];
				$messages = $result['messages'];
			}
			$output = this.constructor.returnAliasModifiers($output, $aliasMods);
		}
		return {
			'output': $output,
			'messages': $messages,
			'errors': $errors,
		};
	}
}
module.exports = GdsDialectTranslator;
