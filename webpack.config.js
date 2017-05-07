const path = require("path");
const webpack = require("webpack");
const autoprefixer = require("autoprefixer");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env = {}) => {
	const isProduction = env.production === true;

	return {
		entry: {
			app: isProduction ? "./app/app.prod.js" : "./app/app.dev.js"
		},
		output: {
			path: path.resolve(__dirname + "/build"),
			filename: isProduction ? "[name].[hash].js" : "[name].js"
		},
		module: {
			rules: [
				{
					test: /\.scss$/,
					use: ExtractTextPlugin.extract([
						{ loader: "css-loader", options: { importLoaders: 1, minimize: true } },
						{ loader: "postcss-loader", options: { plugins: [autoprefixer] } },
						{ loader: "resolve-url-loader" },
						{ loader: "sass-loader", options: { sourceMap: true } }
					])
				},
				{
					test: /\.png$/,
					use: "url-loader"
				},
				{
					test: /\.(svg|jpg|woff2?|ttf|eot)$/,
					use: "file-loader"
				},
				{
					test: require.resolve("react"),
					loader: "expose-loader?React"
				},
				{
					test: require.resolve("react-dom"),
					loader: "expose-loader?ReactDOM"
				},
				{
					test: require.resolve("react-dom/server"),
					loader: "expose-loader?ReactDOMServer"
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: ["babel-loader", "eslint-loader"]
				}
			]
		},
		resolve: {
			extensions: [".js", ".jsx", ".scss"]
		},
		plugins: (() => {
			const plugins = [
				new ExtractTextPlugin(isProduction ? "app.[hash].css" : "app.css"),
				new HtmlWebpackPlugin({
					template: "index.html"
				})
			];

			if (isProduction) {
				return plugins.concat([
					new webpack.DefinePlugin({
						"process-env": {
							NODE_ENV: JSON.stringify("production")
						}
					}),
					new webpack.optimize.UglifyJsPlugin()
				]);
			}

			return plugins;
		})()
	};
};