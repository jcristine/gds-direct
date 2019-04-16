// namespace Rbs\DataProviders;

const Fp = require('../../Lib/Utils/Fp.js');

let php = require('../../php.js');

/**
 * provides info like city/country/timezone/etc for the specified airport
 */
class StubLocationGeographyProvider {
	constructor($data) {
		let $values;
		if ($data && php.is_numeric(php.array_keys($data)[0])) {
			$data = php.array_combine(php.array_column($data, 'iata_code'), $data);
		}
		this.$data = $data;
		$values = php.array_values(php.array_filter($data));
		this.$cityToData = php.array_combine(php.array_column($values, 'city_code'), $values);
	}

	getLocationData($locationCode) {
		if (php.array_key_exists($locationCode, this.$data)) {
			return this.$data[$locationCode];
		} else if (php.array_key_exists($locationCode, this.$cityToData)) {
			return this.$cityToData[$locationCode];
		} else {
			return null;
		}
	}

	async getTimezone($locationCode) {
		let $row;
		$row = this.getLocationData($locationCode);
		return $row['tz'];
	}

	async getRegionId($locationCode) {
		let $data;
		$data = this.getLocationData($locationCode);
		return $data['region_id'];
	}

	async getCityCode($airportCode) {
		let $data;
		$data = this.getLocationData($airportCode);
		return $data['city_code'];
	}

	async getCountryCode($airportCode) {
		let $data;
		$data = this.getLocationData($airportCode);
		return $data['country_code'];
	}

	getAlternatives($airportCode) {
		let $data;
		$data = this.getLocationData($airportCode);
		return php.array_filter(php.explode(',', $data['alternatives'] || ''));
	}

	async doesBelongToCity($airportCode, $cityCode) {
		let $alternative, $airportToBorderCities, $airportCity, $cities;
		for ($alternative of Object.values(this.getAlternatives($airportCode))) {
			if (this.getCityCode($alternative) === $cityCode) {
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

module.exports = StubLocationGeographyProvider;
