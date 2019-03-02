// namespace Lib\Utils;

// I guess it really should be replaced by Func library and custom functions
const php = require("../../php");

class Fp {
	static map($function, $arr) {
		return php.array_map($function, $arr);
	}

	/**
	 * @param rows = [
	 *     [a1, a2, a3],
	 *     [b1, b2, b3],
	 *     [c1, c2, c3],
	 * ]
	 * @return array [
	 *     [a1, b1, c1],
	 *     [a2, b2, c2],
	 *     [a3, b3, c3],
	 * ]
	 * @see https://stackoverflow.com/a/10284006/2750743
	 */
	static zip(rows)
	{
		if (rows.length === 0) {
			return [];
		} else {
			return rows[0].map((_,c) => rows.map(row => row[c]));
		}
	}

	static all($function, $arr) {
		let $el;
		for ($el of Object.values($arr)) {
			if (!php.call_user_func($function, $el)) {
				return false;
			}
		}
		return true;
	}

	static filter($function, $arr) {
		return php.array_filter($arr, $function);
	}

	static any($function, $arr) {
		let $el;
		for ($el of $arr) {
			if (php.call_user_func($function, $el)) {
				return true;
			}
		}
		return false;
	}

	static flatten($iterables) {
		let $res, $iterable, $value;
		$res = [];
		for ($iterable of $iterables) {
			for ($value of $iterable) {
				$res.push($value);
			}
		}
		return $res;
	}

	static unique($array) {
		return php.array_unique($array);
	}

	static reverse($array) {
		return php.array_reverse($array);
	}

	/*
	 * groupBy or factor([1,2,3,4,5,6,7], function(x){if (x % 2 === 0) {return 'even';} else {return 'odd';}})  -->
	 * [
	 *   'even' => [2,4,6]
	 *   'odd'  => [1,3,5,7]
	 * ]
	 */
	static groupBy($function, $iterable) {
		let $result, $value, $factorGroup;
		$result = [];
		for ($value of $iterable) {
			$factorGroup = $function($value);
			if (php.array_key_exists($factorGroup, $result)) {
				$result[$factorGroup].push($value);
			} else {
				$result[$factorGroup] = [$value];
			}
		}
		return $result;
	}

	/**
	 * wraps $value into an array if $value is not array
	 */
	static ensureArray($value) {
		return php.is_array($value) ? $value : [$value];
	}

	static minBy($arr, $f) {
		let $minVal, $minCost, $value, $cost;
		$minVal = null;
		$minCost = null;
		for ($value of $arr) {
			$cost = $f($value);
			if (php.is_null($minCost) || $minCost > $cost) {
				$minCost = $cost;
				$minVal = $value;
			}
		}
		return $minVal;
	}

	static maxBy($arr, $f) {
		let $maxVal, $maxCost, $value, $cost;
		$maxVal = null;
		$maxCost = null;
		for ($value of $arr) {
			$cost = $f($value);
			if (php.is_null($maxCost) || $maxCost < $cost) {
				$maxCost = $cost;
				$maxVal = $value;
			}
		}
		return $maxVal;
	}

	static chunk($arr, $n) {
		let $result, $chunk, $i;
		$result = [];
		dance:
		while (true) {
			$chunk = [];
			for ($i = 0; $i < $n; $i++) {
				if (!$arr) {
					if ($chunk) {
						$result.push($chunk);
						$chunk = [];
					}
					break dance;
				} else {
					$chunk.push(php.array_shift($arr));
				}
			}
			$result.push($chunk);
		}
		return $result;
	}

	static sublists($arr, $n) {
		let $result, $i, $chunk, $j;
		$arr = php.array_values($arr);
		$result = [];
		for ($i = 0; $i < php.count($arr) - $n + 1; $i++) {
			$chunk = [];
			for ($j = 0; $j < $n; $j++) {
				$chunk.push($arr[$i + $j]);
			}
			$result.push($chunk);

		}
		return $result;
	}

	static iter($var) {
		return [...$var];
	}

	/**
	 * Basically Python's itertools+product implementation
	 * Makes product (i+e+ all combinations of elements) of arrays:
	 * product([a, b], [c, d], [e, f]) =>
	 * [a, c, e], [a, c, f], [a, d, e], [a, d, f],
	 * [b, c, e], [b, c, f], [b, d, e], [b, d, f],
	 */
	static product(...$args) {
		let $pools, $result, $pool, $resultInner, $x, $y;
		$pools = php.array_map([this.class, 'iter'], $args);
		$result = [[]];
		for ($pool of $pools) {
			$resultInner = [];
			for ($x of $result) {
				for ($y of $pool) {
					$resultInner.push(php.array_merge($x, [$y]));
				}
			}
			$result = $resultInner;
		}
		return $result;
	}

	/**
	 * Chunk a list on elements that match $predicate+ $mode decides how to treat separator element:
	 * * last  -- append to the last chunk (i+e+ "last element in a chunk")
	 * * first -- prepend to the next chunk (i+i+ "first element in a chunk")
	 * * skip  -- simply treat as a separator and don't add to any chunk
	 */
	static chunkBy($predicate, $collection, $mode) {
		let $result, $currentChunk, $el;
		if (!php.in_array($mode, ['last', 'skip', 'first'])) {
			throw new require('../../Exception.js')('3rd argument of chunkBy must be one of [last, skip, first]');
		}
		if (php.empty($collection)) {
			return [];
		}
		$result = [];
		$currentChunk = [];
		for ($el of $collection) {
			if ($predicate($el)) {
				if ($mode === 'last') {
					$currentChunk.push($el);
					$result.push($currentChunk);
					$currentChunk = [];
				} else if ($mode === 'first') {
					$result.push($currentChunk);
					$currentChunk = [$el];
				} else /*($mode === 'skip')*/ {
					$result.push($currentChunk);
					$currentChunk = [];
				}
			} else {
				$currentChunk.push($el);
			}
		}
		$result.push($currentChunk);
		return $result;
	}

	static sortBy(getValue, arr, reversed = false) {
		let result = Object.values(arr)
			// see https://stackoverflow.com/a/31213792/2750743
			// v8 does not seem to keep order of same values
			.map((data, idx) => ({data, idx}))
			.sort((a,b) => {
				let aval = getValue(a.data);
				let bval = getValue(b.data);
				if (aval > bval) {
					return 1;
				} else if (bval > aval) {
					return -1;
				} else {
					return a.idx - b.idx;
				}
			})
			.map(a => a.data);
		if (reversed) {
			result = result.reverse();
		}
		return result;
	}
}

module.exports = Fp;