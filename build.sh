#!/bin/sh

# less should be installed globally - npm install less -g
# lessc public/_style/less/main.less > public/_style/css/parsed.css

# downloads /node_modules/ if needed
npm install --from-lock-file

startpath=$(pwd)
cd public/frontend
npm install --from-lock-file
node node_modules/webpack/bin/webpack.js --progress --display-modules --sort-modules-by size
cd $startpath
