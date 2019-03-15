
// namespace Rbs\TestUtils;

const AnyGdsStubSession = require('./AnyGdsStubSession.js');

let php = require('../../php.js');

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
        try {
            $commandsLeft = $stubSession.getCommandsLeft();
			unit.assertArrayElementsSubset($expectedOutput, $actual);
			unit.assertEmpty($commandsLeft, 'There are some expected commands left that '+
                'were not used - '+php.implode(', ', php.array_column($commandsLeft, 'cmd')));
        } catch ($exc) {
            let args = process.argv.slice(process.execArgv.length + 2);
            if (args.includes('debug')) {
                console.log('\n$actual\n', JSON.stringify($actual));
            }
            throw $exc;
        }
    }
}
module.exports = GdsActionTestUtil;
