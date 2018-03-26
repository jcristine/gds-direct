var webpack = require('webpack');
var path 	= require('path');

// var UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: {
		'vendor': [
			// 'jquery.terminal/js/jquery.terminal',
			'./src/lib/jquery-terminal',
			'keyboardevent-key-polyfill',
			'jquery.terminal/js/unix_formatting',
			'cli-spinners',
			'noty',
			'tether-drop',
			'whatwg-fetch',
			'jquery-param'
		]
	},

	output: {
		filename: 'vendor.terminal-bundle.js',
		path: path.resolve(__dirname, 'public'),
		library: 'vendor_lib'
	},

	externals: {
		jquery	: 'jQuery'
	},

	plugins: [
		new webpack.DllPlugin({
			path: 'public/vendor.terminal-manifest.json',
			name: 'vendor_lib'
		})

		// ,new UglifyJSPlugin()
	]
};