#!/bin/sh

# less should be installed globally - npm install less -g
# lessc public/_style/less/main.less > public/_style/css/parsed.css

# downloads /node_modules/ if needed
npm install --from-lock-file --no-progress

startpath=$(pwd)
cd public
npm install --from-lock-file --no-progress
node node_modules/webpack/bin/webpack.js --sort-modules-by size
cd $startpath
