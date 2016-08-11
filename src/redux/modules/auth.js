import cookie from 'react-cookie';
// import {push} from 'react-router-redux';

const LOAD = 'uhs/auth/LOAD';
const SET_USER = 'uhs/auth/SET_USER';

const LOGIN = 'uhs/auth/LOGIN';
const LOGIN_SUCCESS = 'uhs/auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'uhs/auth/LOGIN_FAIL';

const LOGOUT = 'uhs/auth/LOGOUT';
const LOGOUT_SUCCESS = 'uhs/auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'uhs/auth/LOGOUT_FAIL';

const TOKEN_EXPIRED = 'uhs/auth/TOKEN_EXPIRED';

export const TOKEN_KEY = 'io.omk.key.token';
export const USER_KEY = 'io.omk.key.user';

const initialState = {
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        user: action.data.user,
        access_token: action.data.token
      };
    case LOGIN:
    case LOGOUT:
      return {
        ...state,
        loading: true
      };
    case LOGIN_SUCCESS:
      const token = action.result.access_token;
      const {user} = action.result;
      cookie.save(TOKEN_KEY, JSON.stringify(token), {path: '/'});
      cookie.save(USER_KEY, JSON.stringify(user), {path: '/'});
      return {
        ...state,
        loading: false,
        error: null,
        user,
        access_token: token
      };
    case LOGOUT_SUCCESS:
    case TOKEN_EXPIRED:
      cookie.remove(TOKEN_KEY, {path: '/'});
      cookie.remove(USER_KEY, {path: '/'});
      return {
        ...state,
        loading: false,
        user: null,
        access_token: null
      };
    case LOGOUT_FAIL:
    case LOGIN_FAIL:
      return {
        ...state,
        loading: false,
        user: null,
        error: action.error.msg
      };
    case SET_USER:
      return {
        ...state,
        user: action.user,
        access_token: action.token
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.auth && globalState.auth.user;
}

export function setUserAndToken(user, token) {
  return {
    type: SET_USER,
    user, token
  };
}

export function load() {
  const user = cookie.load(USER_KEY);
  const token = cookie.load(TOKEN_KEY);
  return {
    type: LOAD,
    data: {user, token}
  };
}

export function login(email, password, captcha) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/admin/login', {
      data: {
        email,
        password,
        captcha
      }
    })
  };
}

export function _logout() {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client, ctx) => client.get('/admin/logout', ctx)
  };
}

export function logout() {
  return (dispatch) => {
    dispatch(_logout());
  };
}

export function tokenExpired() {
  return {type: TOKEN_EXPIRED};
}
