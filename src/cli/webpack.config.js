/**
 * External dependencies
 */
const LiveReloadPlugin = require( 'webpack-livereload-plugin' );
const { CleanWebpackPlugin } = require( 'clean-webpack-plugin' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const path = require( 'path' );

/**
 * WordPress dependencies
 */
const postcssPlugins = require( '@wordpress/postcss-plugins-preset' );

const isProduction = process.env.NODE_ENV === 'production';

const config = {
	mode: isProduction ? 'production' : 'development',
	entry: {
		index: path.resolve( __dirname, '../app/index.js' ),
	},
	output: {
		filename: '[name].[chunkhash].js',
		path: path.resolve( process.cwd(), 'dist' ),
		publicPath: '/',
	},
	devServer: {
		contentBase: path.resolve( process.cwd(), 'dist' ),
		historyApiFallback: true,
	},
	resolve: {
		alias: {
			'blockbook-api': path.resolve( __dirname, '../app/api' ),
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!blockbook-cli).*/,
				use: [
					require.resolve( 'thread-loader' ),
					{
						loader: require.resolve( 'babel-loader' ),
						options: {
							cacheDirectory: true,
							babelrc: false,
							configFile: false,
							presets: [
								require.resolve(
									'@wordpress/babel-preset-default'
								),
							],
							plugins: [
								require.resolve(
									'@babel/plugin-transform-runtime'
								),
							],
						},
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: require.resolve( 'style-loader' ),
					},
					{
						loader: require.resolve( 'css-loader' ),
					},
					{
						loader: require.resolve( 'postcss-loader' ),
						options: {
							ident: 'postcss',
							plugins: postcssPlugins,
						},
					},
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin( {
			template: path.resolve( __dirname, '../app/index.html' ),
		} ),
		! isProduction &&
			new LiveReloadPlugin( {
				port: process.env.WP_LIVE_RELOAD_PORT || 35729,
			} ),
	].filter( Boolean ),
	stats: 'errors-only',
};

module.exports = config;
