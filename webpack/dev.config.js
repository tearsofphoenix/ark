require('babel-polyfill');

// Webpack config for development
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var assetsPath = path.resolve(__dirname, '../static/dist');
var autoprefixer = require('autoprefixer');
var host = (process.env.HOST || 'localhost');
var port = parseInt(process.env.PORT) + 1 || 3001;

var funcs = require('./func');
var createSourceLoader = funcs.createSourceLoader;
var createHappyPlugin = funcs.createHappyPlugin;

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

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

// Since we use .babelrc for client and server, and we don't want HMR enabled on the server, we have to add
// the babel plugin react-transform-hmr manually here.

// make sure react-transform is enabled
babelLoaderQuery.plugins = babelLoaderQuery.plugins || [];
var reactTransform = null;
for (var i = 0; i < babelLoaderQuery.plugins.length; ++i) {
  var plugin = babelLoaderQuery.plugins[i];
  if (Array.isArray(plugin) && plugin[0] === 'react-transform') {
    reactTransform = plugin;
  }
}

if (!reactTransform) {
  reactTransform = ['react-transform', {transforms: []}];
  babelLoaderQuery.plugins.push(reactTransform);
}

if (!reactTransform[1] || !reactTransform[1].transforms) {
  reactTransform[1] = Object.assign({}, reactTransform[1], {transforms: []});
}

// make sure react-transform-hmr is enabled
reactTransform[1].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
});

var baseConfig = require('./base.config');
var devConfig = Object.assign({}, baseConfig);
Object.assign(devConfig, {
  module: {
    loaders: [
      createSourceLoader({
        happy: {id: 'jsx'},
        test: /\.jsx?$/,
        loaders: [
          'babel?' + JSON.stringify(babelLoaderQuery),
          'eslint-loader'],
      }),

      createSourceLoader({
        happy: {id: 'json'},
        test: /\.json$/,
        loader: 'json-loader',
      }),

      createSourceLoader({
        happy: {id: 'css'},
        test: /\.css$/,
        loader: 'style!css'
      }),

      createSourceLoader({
        happy: {id: 'less'},
        test: /\.less$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss!less?outputStyle=expanded&sourceMap'
      }),

      createSourceLoader({
        happy: {id: 'sass'},
        test: /\.scss$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!postcss!sass?outputStyle=expanded&sourceMap'
      }),
      {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
      {test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"},
      {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
      {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"},
      {test: webpackIsomorphicToolsPlugin.regular_expression('images'), loader: 'url-loader?limit=10240'}
    ]
  },
  plugins: [
    // hot reload
    createHappyPlugin('jsx'),
    createHappyPlugin('json'),
    createHappyPlugin('css'),
    createHappyPlugin('less'),
    createHappyPlugin('sass'),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: true,
      __DEVTOOLS__: false  // <-------- DISABLE redux-devtools HERE
    })
  ]
});

module.exports = devConfig;

if (process.env.MAKE_DLL) {
  module.exports.entry = {
    vendor: vendorArray(),
    main: [
      './src/client.js'
    ]
  };
  module.exports.output = {
    path: assetsPath,
    filename: '[name]-dll.js',
    library: '[name]_library',
    publicPath: 'http://' + host + ':' + (port - 1) + '/dist/'
  };
  module.exports.plugins.unshift(
    new webpack.DllPlugin({
      path: path.join(assetsPath, '[name]-manifest.json'),
      name: '[name]_library'
    })
  );
  module.exports.plugins.push(
    webpackIsomorphicToolsPlugin.development()
  );
} else {
  module.exports.entry = {
    main: [
      'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
      './src/client.js'
    ]
  };
  module.exports.output = {
    path: assetsPath,
    filename: 'app.js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  };
  module.exports.plugins.unshift(
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, '..'),
      manifest: require('../static/dist/vendor-manifest.json')
    })
  );
}

function vendorArray() {
  return [
    'babel-polyfill',
    'babel-runtime/core-js',
    'multireducer',
    'react',
    'react-addons-shallow-compare',
    'react-addons-update',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-bootstrap',
    'react-router-redux',
    'redux',
    'redux-connect'
  ];
}
