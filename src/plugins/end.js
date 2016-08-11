/**
 * Created by isaac on 16/7/25.
 */
function loader(context) {
  const {kPluginDidLoad} = require('./constants');
  context.store.dispatch({
    type: kPluginDidLoad
  });
}

loader(window.__context);
