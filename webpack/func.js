/**
 * Created by isaac on 16/7/24.
 */
var HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({size: 5});
var path = require('path');

function createSourceLoader(spec) {
  return Object.keys(spec).reduce(function (x, key) {
    x[key] = spec[key];

    return x;
  }, {
    include: [path.resolve(__dirname, '../src')]
  });
}

function createHappyPlugin(id) {
  return new HappyPack({
    id: id,
    threadPool: happyThreadPool,

    // conveniently disable happy with HAPPY=0
    enabled: process.env.HAPPY !== '0',

    // disable happy caching with HAPPY_CACHE=0
    cache: process.env.HAPPY_CACHE !== '0',

    // make happy more verbose with HAPPY_VERBOSE=1
    verbose: process.env.HAPPY_VERBOSE === '1',
  });
}

module.exports = {
  createSourceLoader: createSourceLoader,
  createHappyPlugin: createHappyPlugin
};
