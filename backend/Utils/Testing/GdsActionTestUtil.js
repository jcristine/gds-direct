

const AnyGdsStubSession = require('./AnyGdsStubSession.js');

let php = require('../../Transpiled/phpDeprecated.js');

/** provides handy functions to not repeat testAction() implementation in each test */
class GdsActionTestUtil
{
	static async testGdsAction(unit, $testCase, $getActual)  {
		let $input, $expectedOutput, $calledCommands, $stubSession, $actual, $commandsLeft;
		$input = $testCase['input'];
		$expectedOutput = $testCase['output'];
		$calledCommands = $testCase['calledCommands'];
		$stubSession = new AnyGdsStubSession($calledCommands);
		$actual = await $getActual($stubSession, $input);
		$commandsLeft = $stubSession.getCommandsLeft();
		unit.assertArrayElementsSubset($expectedOutput, $actual);
		unit.assertEmpty($commandsLeft, 'There are some expected commands left that '+
            'were not used - '+php.implode(', ', php.array_column($commandsLeft, 'cmd')));
	}
}
module.exports = GdsActionTestUtil;
