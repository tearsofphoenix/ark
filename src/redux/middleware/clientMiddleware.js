import {tokenExpired} from 'redux/modules/auth';

export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const ctx = {};

      const {promise, types, ...rest} = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});

      const actionPromise = promise(client, ctx);
      actionPromise.then(
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => {
          const {msg, status, redirect} = error;
          let result = null;
          if (status === 410 || redirect) {
            console.error(msg);
            result = next(tokenExpired());
          } else {
            console.error(msg || '服务器内部错误!');
            result = next({...rest, error, type: FAILURE});
          }
          return result;
        }
      ).catch((error) => {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
