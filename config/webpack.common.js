const fs = require('fs'),
	path = require('path'),
	paths = {
		distPath: 'dist/',
		cssPath: ''
	},
	fileName = 'mcalendar.js',
	CopyWebpackPlugin = require('copy-webpack-plugin'),TextPlugin = require('extract-text-webpack-plugin'),
	ExtractTextPlugin = require('extract-text-webpack-plugin')
	

module.exports = {
	entry: ['@babel/polyfill', path.resolve('src/app.js')],
	output: {
		path: path.resolve(paths.distPath),
		filename: fileName,
		publicPath: '/'
	},
	plugins: [
		new CopyWebpackPlugin(
			[{from: path.resolve('src/html'), to: path.resolve(paths.distPath)}]
		),
		new ExtractTextPlugin(paths.cssPath + '/mcalendar.css')
	]
}
