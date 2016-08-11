/**
 * Created by isaac on 16/7/19.
 */
import fs from 'fs';
import fse from 'fs-extra';
import path from 'path';
import unzip from 'unzip';
import multer from 'multer';
import webpack from 'webpack';
import {randomString} from 'utils/func';
import pluginPackConfig from '../webpack/plugin/dev.config';

// plugin root
//
const kPluginRoot = __dirname + '/plugins';
const kSuccess = 1000;

// upload root
//
const dest = path.resolve(__dirname, '../uploads/');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const suffix = file.mimetype.split('/')[1];
    cb(null, `${randomString()}.${suffix}`);
  }
});

function _loopOnPlugins(looperFunc) {
  if (typeof looperFunc === 'function') {
    const folders = fs.readdirSync(kPluginRoot);
    folders.forEach((folderName) => {
      const pathLooper = path.join(kPluginRoot, folderName);
      const stats = fs.lstatSync(pathLooper);
      // is a plugin folder
      if (stats.isDirectory()) {
        const pluginConfigPath = path.join(pathLooper, 'plugin.json');
        const pluginConfig = fse.readJsonSync(pluginConfigPath);
        if (pluginConfig) {
          looperFunc(pluginConfig, pathLooper);
        } else {
          console.log('[plugin]: fail to read plugin.json', pluginConfigPath);
        }
      } else {
        console.log('[plugin]: ignore file', pathLooper);
      }
    });
  }
}

function generatePluginLoaderJS() {
  // clean up `index.js' under plugin folder
  const lines = [];
  lines.push('/* DO NOT EDIT THIS FILE, GENERATED BY CODE */\n');
  _loopOnPlugins(({name, main, enabled}) => {
    // only import `enabled' plugins
    if (enabled) {
      lines.push(`require('./${name}/${main}');\n`);
    }
  });
  lines.push('require(\'./end\');\n');

  const str = lines.join('\n');
  const loaderPath = path.join(kPluginRoot, 'index.js');
  fse.outputFileSync(loaderPath, str);
}

export function getAllPlugins() {
  const result = [];
  _loopOnPlugins((config) => result.push(config));
  return result;
}

export default function (app) {

  app.use(multer({storage}).single('file'));

  app.get('/plugin/list', (req, res) => {
    const result = getAllPlugins();
    res.json({data: result, total: result.length});
  });

  app.post('/plugin/upload', (req, res) => {
    const {file} = req;
    fs.createReadStream(file.path)
      .pipe(unzip.Extract({path: kPluginRoot}))
      .on('finish', (args) => {
        console.log('[args]', args);
        generatePluginLoaderJS();
        webpack(pluginPackConfig, (error, stats) => {
          console.log(error);
          res.send({code: kSuccess});
        });
      });
  });

  app.post('/plugin/remove', (req, res) => {
    const {name} = req.body;
    // FIXME: may have security bug here!!!
    fse.remove(path.join(kPluginRoot, name), (error) => {
      console.log(error);
      if (error) {
        res.json({code: 0});
      } else {
        generatePluginLoaderJS();
        webpack(pluginPackConfig, (error, stats) => {
          console.log(error);
          res.send({code: kSuccess});
        });
      }
    });
  });

  app.post('/plugin/status', (req, res) => {
    // enable or disable plugin
  });
}
