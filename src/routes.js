import React from 'react';
import { IndexRoute, Route } from 'react-router';
import { USER_KEY, TOKEN_KEY, setUserAndToken } from 'redux/modules/auth';

import {
  App,
  Dashboard,
  Login,
  DynamicComponent,
  PluginView
} from 'containers';

export default (store, req) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      let {auth: {user}} = store.getState();
      if (!user) {
        if (req) {
          // try to load from cookie
          const str = req.cookies[USER_KEY];
          if (str) {
            const obj = JSON.parse(str);
            const token = JSON.parse(req.cookies[TOKEN_KEY]);
            if (obj) {
              user = obj;
              store.dispatch(setUserAndToken(user, token));
            }
          }
        }
      }
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/login');
      }
      cb();
    }

    checkAuth();
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route path="/" component={App} >
      { /* Home (main) route */ }
      <IndexRoute component={Login} />

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin} >
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/plugins" component={PluginView} />
      </Route>

      { /* Routes */ }
      <Route path="login" component={Login} />
      { /* Catch all route */ }
      <Route path="*" component={DynamicComponent} />
    </Route>
  );
};
