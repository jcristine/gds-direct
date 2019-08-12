
const php = require('klesun-node-tools/src/Transpiled/php.js');

/**
 * provides info like city/country/timezone/etc for the specified airport
 */
class LocationGeographyProvider
{
	constructor({Airports = require("../../../Repositories/Airports.js")} = {}) {
		this.Airports = Airports;
	}

	async getLocationData($locationCode) {
		// TODO: cache
		return this.Airports.findByCode($locationCode)
			.catch(exc => this.Airports.findByCity($locationCode));
	}

	async getRegionNameById($regionId) {
		let $regionIdToName;
		// TODO: cache
		$regionIdToName = await this.Airports.getRegionNames();
		return $regionIdToName[$regionId] || null;
	}

	async getCountryNameByCode($countryCode) {
		let $countryCodeToName;
		// TODO: cache
		$countryCodeToName = await this.Airports.getCountryNames();
		return $countryCodeToName[$countryCode] || null;
	}

	async getTimezone($locationCode) {
		let $row, $tz;
		$row = await this.getLocationData($locationCode);
		$tz = $row ? $row['tz'] : null;
		return $tz;
	}

	async getRegion($locationCode) {
		let $data;
		$data = await this.getLocationData($locationCode);
		return $data ? $data['region_name'] : null;
	}

	async getRegionId($locationCode) {
		let $data;
		$data = await this.getLocationData($locationCode);
		return $data ? $data['region_id'] : null;
	}

	async getCityCode($airportCode) {
		let $data;
		$data = await this.getLocationData($airportCode);
		return $data ? $data['city_code'] : null;
	}

	async getCountryCode($airportCode) {
		let $data;
		$data = await this.getLocationData($airportCode);
		return $data ? $data['country_code'] : null;
	}

	async getAlternatives($airportCode) {
		let $data;
		$data = await this.getLocationData($airportCode);
		return $data ? php.array_filter(php.explode(',', $data['alternatives'])) : [];
	}

	async doesBelongToCity($airportCode, $cityCode) {
		let $alternative, $airportToBorderCities, $airportCity, $cities;
		for ($alternative of Object.values(await this.getAlternatives($airportCode))) {
			if (await this.getCityCode($alternative) === $cityCode) {
				return true;
			}
		}
		$airportToBorderCities = {
			'EWR': ['NYC'],
			'ROB': ['MLW'],
			'HBE': ['ALY'],
		};
		if ($airportCode === $cityCode) {
			return true;
		} else if ($airportCity = await this.getCityCode($airportCode)) {
			if ($airportCity === $cityCode) {
				return true;
			} else if ($cities = $airportToBorderCities[$airportCode] || null) {
				// sometimes airport is located on the boundary of two cities
				// and because of that can be priced in either of them
				return php.in_array($cityCode, $cities);
			}
		}
		return false;
	}
}

module.exports = LocationGeographyProvider;
