//var path = require('path');
const webpack 			= require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLess 		= new ExtractTextPlugin({
	filename: 'public/main.css'
});

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {

	entry: [
		"./src/app.es6",
		"./src/theme/main.less"
	],

	output: {
		filename: "./public/bundle.js"
	},

	// debug	: true,
	devtool: 'source-map',

	resolve : {
		extensions 	: ['.js', '.json', '.es6'],

		modules		: [
			"node_modules"
		]
	},

	module: {

		rules: [
			// {
			// 	test: /\.(js|es6)$/,
			// 	exclude: /(node_modules|bower_components)/,
			// 	use: {
			// 		loader: 'babel-loader',
			// 		options: {
			// 			presets: ['']
			// 		}
			// 	}
			// },

			{
				test: /\.es6$/,
				loader: 'babel-loader',
				query: {
					presets: [ "babel-preset-es2015" ].map(require.resolve)
				}
			},

			{
				test: /\.less$/,
				use: extractLess.extract({
					use		: [{loader: "css-loader"}, {loader: "less-loader"}],
					fallback: "style-loader"
				})
			}
		]
	},

	externals: {
		jquery			: 'jQuery'
		// 'tether-drop' 	: 'Drop',
		// 'noty' 			: 'Noty'
		// import Drop from 'tether-drop';
	},

	plugins: [
		extractLess
		// ,new BabiliPlugin()
		// ,new UglifyJSPlugin()
	]
};
