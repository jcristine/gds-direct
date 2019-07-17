#!/bin/sh

# less should be installed globally - npm install less -g
# lessc public/_style/less/main.less > public/_style/css/parsed.css

# downloads /node_modules/ if needed
npm ci || exit 1;

startpath=$(pwd)
cd public
npm ci || exit 1;
node node_modules/webpack/bin/webpack.js --sort-modules-by size || exit 1;
cd $startpath
