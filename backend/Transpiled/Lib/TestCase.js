
// namespace Lib;

// add this to generated require() - '../../../backend/Transpiled/'

let {jsExport} = require("../../Utils/Misc");

let php = require('../php.js');

let findStrMismatch = (a, b) => {
	for (let i = 0; i < Math.max(a.length, b.length); ++i) {
		if (a[i] !== b[i]) {
			return i;
		}
	}
	return 0;
};

let describeMismatch = (expected, infix, actual, msg = '') => {
	let explanation = '';
	if (typeof expected === 'string' && typeof actual === 'string') {
		let mismatchAt = findStrMismatch(expected, actual);
		explanation += '\n'
			+ ' expected ...' + jsExport(expected.slice(mismatchAt, mismatchAt + 50))
			+ ' actual ...' + jsExport(actual.slice(mismatchAt, mismatchAt + 50))
			;
	}
	return 'Failed asserting that expected value \n' +
		(jsExport(expected) + '').slice(0, 600) + '\n' + infix + ' actual \n' +
		(jsExport(actual) + '').slice(0, 600) + explanation + '\n' + msg;
};

class TestCase
{
	constructor() {
		/** @type {function(ITestEvent)} */
		this.log = (e) => { throw new Error('Please define test event logger'); };
	}

	_ok() {
		process.stdout.write('.');
		this.log({type: 'ok'});
		return true;
	}

	_err(msg) {
		process.stdout.write('E');
		throw new Error(msg);
		this.log({type: 'error', msg: msg});
		return false;
	}

	_isList($arr)  {
		return !$arr || php.array_keys($arr) === php.range(0, php.count($arr) - 1);
	}

	assertArrayElementsSubsetInternal($expectation, $reality, $message = '', $noExtraIndexes = false) {
		let $key, $value;
		if (php.is_array($expectation) && php.is_array($reality)) {
			for ([$key, $value] of Object.entries($expectation)) {
				this.assertArrayHasKey($key, $reality, $message);
				this.assertArrayElementsSubsetInternal($value, $reality[$key], $message+'['+$key+']', $noExtraIndexes);
			}
			if ($noExtraIndexes && this._isList($expectation)) {
				this.assertLessThanOrEqual(php.count($expectation), php.count($reality), $message+' actual list is longer than expected');
			}
		} else {
			if (php.is_array($expectation) && !php.is_array($reality)) {
				$message += ' (actual is not array)';
			} else if (!php.is_array($expectation) && php.is_array($reality)) {
				$message += ' (expected is not array)';
			}
			this.assertSame($expectation, $reality, $message);
		}
	}

	/**
	 * Asserts arraySubset, but more verbosily
	 *
	 * @param bool $noExtraIndexes - checks number of elements in non-associative
	 * arrays - useful if you need to test that empty array is returned for example
	 *
	 * @param  string  $message
	 * @throws PHPUnit_Framework_AssertionFailedError
	 */
	assertArrayElementsSubset($expectation, $reality, $message = '', $noExtraIndexes = false)  {
		try {
			return this.assertArrayElementsSubsetInternal($expectation, $reality, $message, $noExtraIndexes);
		} catch (exc) {
			let args = process.argv.slice(process.execArgv.length + 2);
			if (args.includes('debug')) {
				console.log('\n$reality\n', JSON.stringify($reality));
			}
			throw exc;
		}
	}

	assertSame(expected, actual, msg) {
		// there is no difference between undefined and null in php, so should not be here
		expected = expected === undefined ? null : expected;
		actual = actual === undefined ? null : actual;
		if (expected === actual) {
			return this._ok();
		} else {
			let fullMsg = describeMismatch(expected, 'is identical to', actual, msg);
			return this._err(fullMsg);
		}
	}

	assertEmpty(value, msg) {
		if (php.empty(value)) {
			return this._ok();
		} else {
			return this._err('Failed asserting that value is empty - ' + msg);
		}
	}

	assertEquals(expected, actual, msg) {
		if (expected == actual) {
			return this._ok();
		} else {
			let fullMsg = describeMismatch(expected, 'equals', actual, msg);
			return this._err(fullMsg);
		}
	}

	assertArrayHasKey(key, assoc, msg) {
		if (key in assoc) {
			return this._ok();
		} else {
			return this._err('Failed asserting that array has the key ' + key + '\n' + msg);
		}
	}

	assertLessThanOrEqual(expected, actual, msg) {
		if (actual <= expected) {
			return this._ok();
		} else {
			let fullMsg = 'Failed asserting that actual ' +
				actual + ' is <= than expected ' + expected +
				' has the key ' + key + '\n' + msg;
			return this._err(fullMsg);
		}
	}

	/**
	 * @abstract
	 * @return {[function(): string | null]} - array of functions
	 * that return an error string, or null, if there was no error
	 */
	getTestMapping() {
		throw new Error('Please, redefine abstract getTestMapping() in your Unit Test class');
	}

	// ew, I lost the point while writing this, so it's now
	// messed up with both exceptions and logging... sorry
	async getTests() {
		let tests = [];
		for (let [provide, test] of this.getTestMapping()) {
			let testCases = await provide.call(this);
			let moreTests = testCases.map((dataset, i) => async () => {
				let testEvents = [];
				this.log = (e) => testEvents.push(e);
				try {
					await test.call(this, ...dataset);
				} catch (exc) {
					testEvents.push({type: 'error', msg: 'Uncaught exception ' + exc.message + '\n' + exc.stack});
				}
				this.log = (e) => { throw new Error('Please define test event logger'); };
				return testEvents.every(e => e.type === 'ok') ? null :
					'\ndataset ' + this.constructor.name + '.' + test.name + ' #' + i + ' ' + testEvents
						.filter(e => e.type === 'error').map((e) => e.msg).join('\n');
			});
			tests.push(...moreTests);
		}
		return tests;
	}
}

module.exports = TestCase;
