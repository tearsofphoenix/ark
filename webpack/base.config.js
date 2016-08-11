/**
 * Created by isaac on 16/8/7.
 */

var path = require('path');
var autoprefixer = require('autoprefixer');

var rootPath = path.resolve(__dirname, '..');

module.exports = {
  context: rootPath,
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
  },
};
