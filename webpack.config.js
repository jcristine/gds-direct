//var path = require('path');
//var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractLess = new ExtractTextPlugin({
	filename: 'public/main.css'
});


module.exports = {

	entry: [
		"./src/app.js6",
		"./src/theme/main.less"
	],

	output: {
		filename: "./public/bundle.js"
	},

	// debug	: true,

	devtool: 'source-map',

	resolve : {
		extensions : ['.js', '.json', '.js6']
	},

	module: {

		loaders: [
			{
				test		: /\.js6$/,
				exclude		: /node_modules/,
				loader		: 'babel-loader',
				query		: {
					presets: [ 'es2015' ]
				}
			}
			//,
			//
			//{
			//	test: /.less$/,
			//	loader: ExtractTextPlugin.extract({
			//		fallback: 'style-loader',
			//		use		: "css-loader!less-loader"
			//	})
			//}
		],

		rules: [{
			test: /\.less$/,
			use: extractLess.extract({
				use: [{
					loader: "css-loader"
				}, {
					loader: "less-loader"
				}],
				// use style-loader in development
				fallback: "style-loader"
			})
		}]
	},

	// externals: {
	// 	jquery: 'jquery'
	// },

	plugins: [
		extractLess
	]
};
