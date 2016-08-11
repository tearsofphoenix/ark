import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as reduxAsyncConnect} from 'redux-connect';

import auth from './auth';
import ui from './ui';
import plugin from './plugin';

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  auth,
  plugin,
  ui,
});
