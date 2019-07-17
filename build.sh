#!/bin/sh

npm ci || exit 1;

startpath=$(pwd)
cd public
npm ci || exit 1;
node node_modules/webpack/bin/webpack.js --sort-modules-by size || exit 1;
cd $startpath
