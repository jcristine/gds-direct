'use strict';

define([], function() {// Constants for managing URL parameter keys/values
// Please do not change const keys, only values!

	return {
		// Contains all possible panel IDs
		PANELS : {
			// Top menu
			reminders: 'reminders',

			// Open Request
			marketing: 'marketing',
			priceQuote: 'priceQuote',
			priceQuoteClone: 'priceQuoteClone',
			preferences: 'preferences',
			airlineFunFact: 'AFF-'
		},

// Contains all possible Modal IDs
		MODALS : {
			// Top menu
			notificationsList: 'notificationsList',
			pnrsList: 'pnrsList',

			// Open Request & Request List
			callHistory: 'callHistory',
			emailHistory: 'emailHistory',
			sendFeedback: 'sendFeedback',
			sendPQ: 'sendPQ',

			// Open request Price Quotes
			sendToCS: 'sendToCS',
			viewDump: 'viewDump',
			requestPNR: 'requestPNR',
			createSale: 'createSale',
			comparePQs: 'comparePQs'
		},

// Contains all possible URL keys
		VARS : {
			// Modals
			modalId: 'mId', // Modal ID
			modalData: 'mData', // Data related to modal opening

			// Selected (checkbox) list
			pqList: 'pqList', // Travel request list
			travelRequestList: 'trList', // Open request Price Quotes

			// Call History
			tab: 'tab', // Selected tab
			phone: 'phone', // Selected phone number

			// Email History
			folder: 'f', // Email folder
			template: 't', // Email template
			doNotShowHeader: 'noH', // Hide email header
			doNotShowFooter: 'noF', // Hide email footer
			history: 'h', // History tabs

			pqcId: 'pqcId', // Price Q clone id

			// Create Travel Request shorthand vars
			// Marketing info
			marketingEmailContent: 'mEmail',
			'createInfo[marketingVoucherCode]': 'vCode',
			'createInfo[discountCode]': 'dCode',

			// Client Info
			'customer[firstName]': 'fName',
			'customer[middleName]': 'mName',
			'customer[lastName]': 'lName',
			phones: 'phones',
			emails: 'emails',

			// Flight Details
			flights: 'flights',

			// Preferences
			'preferences[callHoursFrom]': 'cFrom',
			'preferences[callHoursTo]': 'cTo',
			'preferences[userRequestedCurrencyId]': 'currency',
			'preferences[purpose]': 'purpose',
			'preferences[preferredLanguageId]': 'lang',
			'preferences[needHotelAccommodation]': 'hotel',
			'preferences[marketPrice]': 'mPrice',
			'preferences[budgetPerAdult]': 'budget',
			'preferences[numberOfStops]': 'stops',
			'preferences[comments]': 'c',
			preferencesMainValues: 'mainValues',
			airlines: 'airlines'
		}
	};
});