const path = require('path');
const webpack = require('webpack');
/** Clean Dist Folder When Run Build */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

const HtmlWebpackPlugin = require('html-webpack-plugin');

/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

module.exports = {
	mode: 'development',
	/** Enable Source Map */
	devtool: 'inline-source-map',
	entry: {
		main: './src/main.js',
		vendor: ['bootstrap', './src/vendor/vendor.js']
	},

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},

	watch: true,
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
		ignored: ['node_modules']
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css'
		}),
		/** Sử dụng Jquery trong Webpack */
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			'window.jQuery': 'jquery'
		}),
	],
	module: {
		rules: [
			/** ES6 => ES5 */
			{
				test: /.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env"],
						plugins: ["@babel/plugin-syntax-dynamic-import", "@babel/transform-runtime"]
					}
				}
			},
			/** SASS Loaded */
			{
				test: /.(sass|scss|css)$/,
				use: 
				[
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							publicPath: '../',
							hmr: process.env.NODE_ENV === 'development'
						}
					},
					{
						loader: 'css-loader'
					},
					{ 
						loader: 'sass-loader'
					}
				],
			},
			/** File Loader - URL Loader : Load url file from CSS (Background - font - icon) */
			{	
				test: /\.(otf|woff|woff2|eot|ttf|otf)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/',
							publicPath: '../fonts/'
						}
					}
				]
			},
			/** URL Loader Convert Data To Data64 If Size < Limit, Or Mode File To Output Path (Like File Loader) */
			{
				test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
				use: 
				[

					{
						loader: 'url-loader',
						options: {
							name: '[name].[ext]',
							limit: 8000,
							outputPath: './images/',
							publicPath: './images/'
						}
					}
				]
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
				
			}
		]
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					priority: -10,
					test: /[\\/]node_modules[\\/]/
				}
			},

			chunks: 'async',
			minChunks: 1,
			minSize: 30000,
			name: true
		}
	},

	devServer: {
		open: true,
		contentBase: './dist'
	}
};
