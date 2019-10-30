#!/usr/bin/env bash
node tests/run.js || exit 1;
node node_modules/gds-utils/scripts/runTests.js || exit 1;
# probably could call it from run.js...
node node_modules/madge/bin/cli.js --circular backend || exit 1;
