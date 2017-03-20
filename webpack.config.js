//var path = require('path');
//var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {

	entry: [
		"./src/app.js"
		,"./src/theme/main.less"
	],

	output: {
		filename: "./public/bundle.js"
	},

	// debug	: true,
	 devtool: 'source-map',

	module: {

		loaders: [
			{
				test		: /\.js$/,
				exclude		: /node_modules/,
				loader		: 'babel-loader',
				query		: {
					presets: [ 'es2015' ]
				}
			},

			{
				test: /.less$/,
				loader: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use		: "css-loader!less-loader"
				})
			}
			//,
			//{
			//	test: /\.css$/,
			//	loader: 'style!css?sourceMap'
			//},
			//{
			//	test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
			//	loader: "url?limit=10000&mimetype=application/font-woff"
			//}, {
			//	test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
			//	loader: "url?limit=10000&mimetype=application/font-woff"
			//}, {
			//	test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
			//	loader: "url?limit=10000&mimetype=application/octet-stream"
			//}, {
			//	test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
			//	loader: "file"
			//}, {
			//	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			//	loader: "url?limit=10000&mimetype=image/svg+xml"
			//}
		]
	}
	,

	plugins: [
		new ExtractTextPlugin('public/main.css')
	]
};
