/**
 * Created by isaac on 16/6/4.
 */
function loader(context, plugins) {
  const {React, store} = context;
  const {Component} = React;
  const {kPluginLoad} = require('../constants');
  class Dummy extends Component {
    render() {
      return (<div style={{width: '100%', height: '100%', color: 'red'}} >Hello, word!</div>);
    }
  }

  const pluginConfig = {
    component: Dummy,
    config: require('./plugin.json')
  };
  plugins.Dummy = pluginConfig;
  const {dispatch} = store;
  dispatch({
    type: kPluginLoad,
    data: pluginConfig
  });
}

loader(window.__context, window.__plugins);
