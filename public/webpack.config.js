var path 				= require('path');
var webpack 			= require('webpack');

module.exports = {

	entry: [
		"./src/app.es6",
	],

	output: {
		path: path.resolve(__dirname, "./"),
		filename: "terminal-bundle.js",
	},

	// turns code minification on
	mode 	: 'production',
	devtool	: 'source-map',

	resolve : {
		extensions 	: ['.js', '.es6'],
		modules		: [
			"node_modules",
		],
	},

	module: {
		rules: [
			{
				test	: /\.es6$/,
				exclude	: /node_modules/,
				use		: {
					loader: 'babel-loader',
					options: {
						presets: ['env'],
						plugins: [require('babel-plugin-transform-object-rest-spread')],
					},
				},
			},
			{
				test: /\.less$/,

				include: path.resolve(__dirname, "src"),

				use: [{
					loader: "style-loader", // creates style nodes from JS strings
				}, {
					loader: "css-loader", // translates CSS into CommonJS
				}, {
					loader: "less-loader", // compiles Less to CSS
				}],
			},
		],
	},

	plugins: [
		new webpack.ProvidePlugin({
			jQuery: 'jquery',
			$: 'jquery',
		}),
	],
};
