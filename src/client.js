/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import {Provider} from 'react-redux';
import {Router, browserHistory, match} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {ReduxAsyncConnect} from 'redux-connect';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import superagent from 'superagent';
import * as stardust from 'stardust';

import getRoutes from './routes';

require('./theme/semantic-ui/semantic.min.css');
require('./theme/app.css');
require('./components/LoadingPage/style.css');

try {
  const client = new ApiClient();
  const _browserHistory = useScroll(() => browserHistory)();
  const dest = document.getElementById('content');
  const store = createStore(_browserHistory, client, window.__data);
  const history = syncHistoryWithStore(_browserHistory, store);

  const routes = getRoutes(store);

// prepare context for plugins
  window.__context = {React, superagent, store, stardust};
// prepare to store plugin classes
  window.__plugins = {};

  match({history, routes}, (error, redirectLocation, renderProps) => {
    const component = (
      <Router {...renderProps} render={(props) =>
        <ReduxAsyncConnect {...props} helpers={{client}} filter={item => !item.deferred} />
      } history={history} routes={routes} />
    );

    ReactDOM.render(<Provider store={store} key="provider" >{component}</Provider>, dest);

    if (process.env.NODE_ENV !== 'production') {
      window.React = React; // enable debugger

      if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
        console.error('Server-side render discarded. Make sure your initial render not contain any client-side code.');
      }
    }
  });
} catch (exception) {
  console.log(exception);
}

