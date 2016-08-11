require('babel-polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

const {HOST, PORT, APIHOST, APIPORT} = process.env;
module.exports = Object.assign({
  host: HOST || 'localhost',
  port: PORT,
  rootURL: '/asset',
  apiHost: APIHOST || 'localhost',
  apiPort: APIPORT,
  app: {
    title: 'Ark',
    description: '',
    head: {
      titleTemplate: 'UHS: %s',
      meta: [
        {charset: 'utf-8'}
      ]
    }
  }

}, environment);
