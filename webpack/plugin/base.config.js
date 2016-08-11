/**
 * Created by isaac on 16/7/25.
 */
var path = require('path');
var funcs = require('../func');
var createSourceLoader = funcs.createSourceLoader;
var autoprefixer = require('autoprefixer');

module.exports = {
  context: path.resolve(__dirname, '../..'),
  module: {
    loaders: [
      createSourceLoader({
        happy: {id: 'json'},
        test: /\.json$/,
        loader: 'json-loader',
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
      {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"}
    ]
  },
  externals: {
    'react': 'React',
    'superagent': 'superagent'
  },
  postcss: function () {
    return [autoprefixer({browsers: ['last 2 versions']})];
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js', '.jsx']
  }
};
