
// namespace Lib;

// add this to generated require() - '../../../backend/Transpiled/'

let php = require('../php.es6');

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
		let $key, $value;
		if (php.is_array($expectation) && php.is_array($reality)) {
			for ([$key, $value] of Object.entries($expectation)) {
				this.assertArrayHasKey($key, $reality, $message);
				this.assertArrayElementsSubset($value, $reality[$key], $message+'['+$key+']', $noExtraIndexes);}
			if ($noExtraIndexes && this._isList($expectation)) {
				this.assertLessThanOrEqual(php.count($expectation), php.count($reality), $message+' actual list is longer than expected');
			}
		} else {
			this.assertSame($expectation, $reality, $message);
		}
	}

	assertSame(expected, actual, msg) {
		if (expected === actual) {
			return this._ok();
		} else {
			let fullMsg = 'Failed asserting that expected value \n' +
				(JSON.stringify(expected) + '').slice(0, 600) + '\nis identical to actual \n' +
				(JSON.stringify(actual) + '').slice(0, 600) + '\n' + msg;
			return this._err(fullMsg);
		}
	}

	assertEquals(expected, actual, msg) {
		if (expected == actual) {
			return this._ok();
		} else {
			let fullMsg = 'Failed asserting that expected value \n' +
				(JSON.stringify(expected) + '').slice(0, 600) + '\nequals actual \n' +
				(JSON.stringify(actual) + '').slice(0, 600) + '\n' + msg;
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
	getTests() {
		return this.getTestMapping()
			.map(([provide, test]) => {
				return provide.call(this).map((dataset, i) => () => {
					let [input, expected] = dataset;
					let testEvents = [];
					this.log = (e) => testEvents.push(e);
					try {
						test.call(this, input, expected);
					} catch (exc) {
						testEvents.push({type: 'error', msg: 'Uncaught exception ' + exc.message + '\n' + exc.stack});
					}
					this.log = (e) => { throw new Error('Please define test event logger'); };
					return testEvents.every(e => e.type === 'ok') ? null :
						'\ndataset ' + this.constructor.name + '.' + test.name + ' #' + i + ' ' + testEvents
							.filter(e => e.type === 'error').map((e) => e.msg).join('\n');
				});
			})
			.reduce((all,chunk) => all.concat(chunk), []);
	}
}

module.exports = TestCase;
