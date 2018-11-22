#!/bin/sh

# less should be installed globally - npm install less -g
lessc _style/less/main.less > _style/css/parsed.css

# downloads /node_modules/ if needed
npm install --from-lock-file

startpath=$(pwd)
cd frontend
npm install --from-lock-file
node node_modules/webpack/bin/webpack.js --progress --display-modules --sort-modules-by size
cd $startpath
