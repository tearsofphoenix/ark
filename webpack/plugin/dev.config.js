/**
 * Created by isaac on 16/7/24.
 */
require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var funcs = require('../func');
var createSourceLoader = funcs.createSourceLoader;
var createHappyPlugin = funcs.createHappyPlugin;

var assetsPath = path.resolve(__dirname, '../../static/dist/plugins');

var baseConfig = require('./base.config');
var devConfig = Object.assign({}, baseConfig);

var babelrc = fs.readFileSync('./.babelrc');
var babelrcObject = {};

try {
  babelrcObject = JSON.parse(babelrc);
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

var babelrcObjectDevelopment = babelrcObject.env && babelrcObject.env.development || {};

// merge global and dev-only plugins
var combinedPlugins = babelrcObject.plugins || [];
combinedPlugins = combinedPlugins.concat(babelrcObjectDevelopment.plugins);

var babelLoaderQuery = Object.assign({}, babelrcObjectDevelopment, babelrcObject, {plugins: combinedPlugins});
delete babelLoaderQuery.env;

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];

devConfig.entry = './src/plugins/index.js';
devConfig.output = {
  filename: 'index.min.js',
  path: assetsPath
};
devConfig.module.loaders.unshift(createSourceLoader({
  happy: {id: 'jsx'},
  test: /\.jsx?$/,
  loaders: ['babel?' + JSON.stringify(babelLoaderQuery), 'eslint-loader'],
}));
devConfig.plugins = [
  // hot reload
  createHappyPlugin('jsx'),
  createHappyPlugin('json'),
  createHappyPlugin('less'),
  createHappyPlugin('sass'),
  new webpack.IgnorePlugin(/webpack-stats\.json$/),
  new webpack.DefinePlugin({
    __CLIENT__: true,
    __SERVER__: false,
    __DEVELOPMENT__: true,
    __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
  })
];

module.exports = devConfig;
