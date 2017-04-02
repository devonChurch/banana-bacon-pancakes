const { resolve } = require('path');
const WebpackShellPlugin = require('webpack-shell-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const isProduction = !(process.env.NODE_ENV === 'development');

module.exports = () => ({

	entry: ['babel-polyfill', './src/'],

	output: {
		path: resolve(__dirname, 'dist/public/js'),
		filename: 'client.js',
	},

	module: {

		rules: [
			{
				enforce: 'pre',
				test: /\.js$/,
				include: [
					resolve(__dirname, 'src'),
				],
				use: [
					{ loader: 'eslint-loader' },
				],
			},

			{
				test: /\.js$/,
				include: [
					resolve(__dirname, 'src'),
				],
				use: [
					{ loader: 'babel-loader' },
				],
			},

			{
				test: /\.scss$/,
				include: [
					resolve(__dirname, 'src'),
				],
				use: ExtractTextPlugin.extract({
					use: [
						{ loader: 'css-loader' },
						{ loader: 'postcss-loader' },
						{ loader: 'sass-loader' },
					],
					// Instead of using the ExtractTextPlugin in "development"
					// we instead inject the styles directly into the JS to speed
					// things up =)
					fallback: 'style-loader',
				}),
			},

		],

	},

	plugins: [

		new ExtractTextPlugin({
			filename: '../css/client.css',
			disable: !isProduction,
		}),

		new WebpackShellPlugin({

			onBuildStart: [
				`echo "webpack start (${ isProduction ? 'production' : 'development'}) sequence"`,
			],

			onBuildEnd: isProduction ? [] : [
				'echo "transfer assets to local s3"',
				'curl -XPUT -T ./dist/public/js/client.js localhost:8004/research-hub/',
			]
		}),

	],

	devtool: isProduction ? 'source-map' : 'eval',

	context: __dirname,

	target: 'web',

	devServer: {

		contentBase: resolve(__dirname, 'src'),

	},

});
