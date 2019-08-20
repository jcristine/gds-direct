

const fetchAll = require("../../GdsHelpers/TravelportUtils").fetchAll;

const php = require('../../Transpiled/phpDeprecated.js');

/**
 * this is a helper class for tests
 * you pass it predefined 'calledCommands' and use as normal session
 * if you try to call commands that were not predefined, exception will be thrown
 */
class AnyGdsStubSession extends require('./TStubGdsClient.js')
{
	setGds($gds)  {
		this.$gds = $gds;
		return this;
	}

	async runCmd($cmd)  {
		let $i, $result, $output;
		$i = this.$commandIndex;
		if (!($result = php.array_shift(this.$commandsLeft))) {
			throw new Error('Tried to call '+$i+'-th command >'+$cmd+'; when all stubbed results were already used');
		} else if (this.$cmdMustBeSame && $result['cmd'] !== $cmd) {
			throw new Error('Unexpected '+$i+'-th command \n>'+$cmd+';\n was called in place of \n>'+$result['cmd']+';\n');
		} else {
			++this.$commandIndex;
			$output = $result['output'];
			return Promise.resolve({
				cmd: $cmd,
				output: $output,
				duration: '0.01',
			});
		}
	}

	getSessionToken()  {
		return null;
	}

	closeSession()  {
		if (this.$commandsLeft) {
			// should separate sessions in GDS Direct tests one day
			//$cmds = Fp::map(function($rec){return $rec['cmd'] ?? $rec['method'] ?? 'unknown';}, $this->commandsLeft);
			//throw new \Exception('Tried to close session when there are still '.count($this->commandsLeft).' commands left: '.implode(', ', $cmds));
		}
	}

	getCurrentFareRules($params)  {
		let $fareNum, $sections, $cmd, $output;
		$fareNum = $params['fareComponentNumber'] || null;
		$sections = $params['paragraphs'] || null;
		if (php.in_array(this.$gds, ['apollo', 'galileo'])) {
			$cmd = 'FN'+$fareNum+'/'+php.implode('/', $sections || ['ALL']);
			$output = fetchAll($cmd, this);
			return {'cmd': $cmd, 'output': $output};
		} else {
			throw new Error('Invalid GDS - '+this.$gds);
		}
	}

	getStatelessFareRules($params)  {
		return this.runXml(php.__FUNCTION__, $params);
	}

	listQueuePnrs($params)  {
		return this.runXml(php.__FUNCTION__, $params);
	}

	getCarAvailabilityMatrix($params)  {
		return this.runXml(php.__FUNCTION__, $params);
	}

	searchSuperBestBuy($params)  {
		return this.runXml(php.__FUNCTION__, $params);
	}

	processPnr($params)  {
		return this.runXml(php.__FUNCTION__, $params);
	}

	addAirSegments($params)  {
		return this.runXml(php.__FUNCTION__, $params);
	}

	getPnr($params)  {
		return this.runXml(php.__FUNCTION__, $params);
	}
}
module.exports = AnyGdsStubSession;
