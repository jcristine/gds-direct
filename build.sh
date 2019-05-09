#!/bin/sh

# less should be installed globally - npm install less -g
# lessc public/_style/less/main.less > public/_style/css/parsed.css

# downloads /node_modules/ if needed
yarn install --frozen-lockfile --no-progress

startpath=$(pwd)
cd public
# gosh, yarn surely is fast, would be nice to use it here too instead of npm
npm install --from-lock-file --no-progress
node node_modules/webpack/bin/webpack.js --sort-modules-by size
cd $startpath
