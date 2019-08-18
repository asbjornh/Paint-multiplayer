/* eslint-env node */
/* eslint-disable no-console */
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const DirectoryNamedPlugin = require('directory-named-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (_env, options = {}) => {
  const isProduction = options.mode === 'production';
  const outputPath = path.resolve(__dirname, './dist');

  return {
    devServer: {
      port: 8080,
      disableHostCheck: true,
      stats: 'minimal'
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
    entry: {
      style: './app/styles/app.scss',
      app: ['whatwg-fetch', './app/app.js']
    },
    output: {
      path: outputPath,
      filename: '[name].[chunkhash].js',
      libraryTarget: 'umd',
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'eslint-loader']
        },
        {
          enforce: 'pre',
          test: /\.scss$/,
          exclude: /node_modules/,
          use: 'import-glob'
        },
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer({ grid: true })].concat(
                  isProduction ? [cssnano] : []
                ),
                sourceMap: true
              }
            },
            { loader: 'resolve-url-loader', options: { removeCR: true } },
            { loader: 'sass-loader', options: { sourceMap: true } }
          ]
        },
        {
          test: /\.(svg|png|jpg|woff2?|ttf|eot)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        components: path.resolve('./app/components'),
        contexts: path.resolve('./app/contexts'),
        hooks: path.resolve('./app/hooks'),
        js: path.resolve('./app/js')
      },
      plugins: [
        new DirectoryNamedPlugin({
          honorIndex: true,
          include: [path.resolve('./app/components')]
        })
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new HtmlWebpackPlugin({
        template: './app/index.html'
      })
    ].concat(
      // NOTE: This plugin currently makes the codebase crash when recompiling using webpack-dev-server
      isProduction ? [new webpack.optimize.ModuleConcatenationPlugin()] : []
    )
  };
};
