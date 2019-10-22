const Parse_priceItinerary = require('gds-utils/src/text_format_processing/sabre/commands/Parse_priceItinerary.js');

exports.cabinClassMapping = Parse_priceItinerary.cabinClassMapping;
exports.parseModifier = Parse_priceItinerary.parseModifier;

/** @deprecated - use from the lib directly */
exports.parse = Parse_priceItinerary;
