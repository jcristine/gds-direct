
// namespace Rbs\TestUtils;

const TestCase = require('../../Lib/TestCase.js');
const Fp = require('../../Lib/Utils/Fp.js');
const BadGateway = require("../../../Utils/Rej").BadGateway;

let php = require('../../php.js');

/**
 * provides getters/setters for a stub GDS session/stateless terminal
 * that is expected to execute defined set of operations during a test
 */
class TStubGdsClient
{
    /**
     * @param bool $hasCommands - when true, $calledCommands
     * is array like ['cmd' => '*HTE', 'output' => 'TKT/123-123234234 ...']
     * @param bool $hasCommands - when false, $calledCommands
     * is array of string outputs
     */
    constructor($calledCommands)  {
		this.$cmdMustBeSame = true;
        this.$commandsLeft = $calledCommands;
		this.$commandIndex = 0;
    }

    async runXml($method, $params)  {
        let $i, $result, $msg, $rpcResult;
        $i = this.$commandIndex;
        if (!($result = php.array_shift(this.$commandsLeft))) {
            throw new Error('Tried to call '+$i+'-th command !'+$method+' when all stubbed results were already used');
        } else if (!php.isset($result['method'])) {
            throw new Error('Unexpected '+$i+'-th XML method !'+$method+' was called in place of >'+$result['cmd']+';');
        } else if ($result['method'] !== $method) {
            throw new Error('Unexpected '+$i+'-th XML method !'+$method+' was called in place of !'+$result['method']);
        } else {
            $msg = 'Unexpected '+$i+'-th XML method !'+$method+' params were passed';
			(new TestCase).assertArrayElementsSubset($result['params'] || null, $params, $msg, true);

            ++this.$commandIndex;
            $rpcResult = $result['output'];
            if (php.empty($rpcResult['errors']) && !php.empty($rpcResult['result'])) {
                return Promise.resolve($rpcResult['result']);
            } else {
                return BadGateway('Got RPC errors ' + ($rpcResult['errors'] || []).join('; '), $result);
            }
        }
    }

    wereAllCommandsUsed()  {
        return php.count(this.getCommandsLeft()) === 0;
    }

    getCommandsLeft()  {
        return this.$commandsLeft;
    }
}
module.exports = TStubGdsClient;
