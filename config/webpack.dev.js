const path = require('path'),
	merge = require('webpack-merge'),
	common = require('./webpack.common.js'),
	{ networkInterfaces } = require('os'),
	nets = networkInterfaces(),
	port = 3001,
	results = [],
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
  paths = {
    dist: ''
  }

require('es6-promise').polyfill()

for (const name of Object.keys(nets)) {
	for (const net of nets[name]) {
		// Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
		if (net.family === 'IPv4' && !net.internal) {
			results.push(net.address)
		}
	}
}

console.log(`To access dev server from local network use this addresss: http://${results}:${port}`)

module.exports = merge(common, {
	mode: 'development',
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'eslint-loader'
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: ['@babel/plugin-proposal-class-properties']
					}
				}
			},
			{ test: /\.(woff|woff2|eot|ttf)$/, loader: 'url-loader?limit=100000' },
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: {
								sourceMap: true
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								config: { path: 'config/' },
								sourceMap: true
							}
						},
						{
							loader: 'sass-loader',
							options: {
								minimize: false,
								sourceMap: true
							}
						}
					]
				})
			}
		]
	},

	stats: {
		// Colored output
		colors: true
	},

	// Create Sourcemaps for the bundle
	devtool: 'source-map',
	devServer: {
		contentBase: path.resolve('dist'),
		compress: false,
		disableHostCheck: true,
		host: results[0],
		port: port,
		hot: true,
		inline: true,
		open: true,
		public: `${results[0]}:${port}`,
		openPage: paths.dist
	}
})
