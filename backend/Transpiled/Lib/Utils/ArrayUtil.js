
const php = require('klesun-node-tools/src/Transpiled/php.js');

class ArrayUtil {
	static overwrite($originalArray, $newArray) {
		let $key, $value;
		for ([$key, $value] of Object.entries($newArray)) {
			if (php.array_key_exists($key, $originalArray)) {
				$originalArray[$key] = $newArray[$key];
			}
		}
		return $originalArray;
	}

	static getFirst($arr) {
		return Object.values($arr)[0];
	}

	static getLast($arr) {
		return Object.values($arr).slice(-1)[0];
	}

	/**
	 * @param $valuesPerRow = [
	 *     ['iata_code' , 'name'                   , 'country_code'],
	 *     ['LAX'       , 'Los Angeles Intl Arpt'  , 'US'          ],
	 *     ['MNL'       , 'Ninoy Aquino Intl Arpt' , 'PH'          ],
	 * ]
	 * @return array [
	 *     ['iata_code' => 'LAX', 'name' => 'Los Angeles Intl Arpt', 'country_code' => 'US'],
	 *     ['iata_code' => 'MNL', 'name' => 'Ninoy Aquino Intl Arpt', 'country_code' => 'PH'],
	 * ]
	 */
	static makeTableRows($valuesPerRow) {
		let $keys, $rows, $values;
		if (!$valuesPerRow) {
			return [];
		} else {
			$keys = php.array_shift($valuesPerRow);
			$rows = [];
			for ($values of Object.values($valuesPerRow)) {
				if (php.count($keys) === php.count($values)) {
					$rows.push(php.array_combine($keys, $values));
				} else {
					throw new Error('Row value count mismatch: ' + php.count($keys) + ' vs ' + php.count($values) + ' ' +
						php.PHP_EOL + php.implode(', ', $keys) + php.PHP_EOL + php.implode(', ', Fp.map('json_encode', $values)));
				}
			}
			return $rows;
		}
	}
}

module.exports = ArrayUtil;
