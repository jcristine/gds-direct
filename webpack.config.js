//var path = require('path');
const webpack 			= require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLess 		= new ExtractTextPlugin({
	filename: 'public/main.css'
});

// const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {

	entry: [
		"./src/app.es6",
		"./src/theme/main.less"
	],

	output: {
		filename: "./public/terminal-bundle.js"
	},

	// debug	: true,
	devtool: 'source-map',

	resolve : {
		extensions 	: ['.js', '.es6'],
		modules		: [
			// path.resolve(__dirname, "src"),
			"node_modules"
		]
	},

	module: {
		rules: [
			{
				test	: /\.es6$/,
				exclude	: /node_modules/,
				use		: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test	: /\.less$/,
				use		: extractLess.extract({
					use		: [{loader: "css-loader"}, {loader: "less-loader"}],
					fallback: "style-loader"
				})
			}
		]
	},

	externals: {
		jquery	: 'jQuery'
	},

	plugins: [
		extractLess

		,new webpack.DllReferencePlugin({
			context: '.',
			manifest: require('./public/vendor.terminal-manifest.json')
		})

		// ,new BabiliPlugin()
		// ,new UglifyJSPlugin()
	]
};
