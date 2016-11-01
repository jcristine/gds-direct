// var path = require('path');
// var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {

	/*entry: [
	 './src/app'
	 // 'babel-polyfill',
	 // './src/theme/main.less',
	 // './src/main',
	 // 'webpack-dev-server/client?http://localhost:8080'
	 ],


	 output: {
	 // publicPath: '/',
	 filename: './public/bundle.js'
	 },*/

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
				test: /\.less$/,
				// loader: "style!css!autoprefixer!less"
				loader: ExtractTextPlugin.extract(
					// activate source maps via loader query
					'css?sourceMap!' +
					'less?sourceMap'
				)
			},
			{
				test: /\.css$/,
				loader: 'style!css?sourceMap'
			},
			{
				test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/font-woff"
			}, {
				test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/font-woff"
			}, {
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=application/octet-stream"
			}, {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loader: "file"
			}, {
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loader: "url?limit=10000&mimetype=image/svg+xml"
			}
		]
	},

	plugins: [
		// extract inline css into separate 'styles.css'
		new ExtractTextPlugin('public/main.css')
	]

	// ,
	// devServer: {
	// 	contentBase: "./src"
	// }
};
