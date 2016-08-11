# React Plugin Skeleton Project
Inspired by [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example)
## Installation
###1) prepare api server (Qodesh)

```bash
git clone git@github.com:tearsofphoenix/Qodesh.git
cd Qodesh/
npm i
npm run dev
```
###2) then prepare frontend server

```bash
git clone git@github.com:tearsofphoenix/ark.git
cd ark/
npm i
```

## Running Dev Server

```bash
npm run dev:prepare
npm run plugin:dev
npm run dev
```
Will pack all js & pack plugins together under `static/dist/plugin/index.min.js`

## Building and Running Production Server

```bash
npm run build
npm run plugin:prod
npm run start
```
##Features
* Plugin System: custom frontend plugin load routine!
* [Universal](https://medium.com/@mjackson/universal-javascript-4761051b7ae9) rendering
* Both client and server make calls to load data from separate API server
* [React](https://github.com/facebook/react)
* [React Router](https://github.com/rackt/react-router)
* [Express](http://expressjs.com)
* [Babel](http://babeljs.io) for ES6 and ES7 magic
* [Webpack](http://webpack.github.io) for bundling with `DLLPlugin` config
* [Webpack Dev Middleware](http://webpack.github.io/docs/webpack-dev-middleware.html)
* [Webpack Hot Middleware](https://github.com/glenjamin/webpack-hot-middleware)
* [Redux](https://github.com/rackt/redux)'s futuristic [Flux](https://facebook.github.io/react/blog/2014/05/06/flux.html) implementation
* [React Router Redux](https://github.com/reactjs/react-router-redux) Redux/React Router bindings.
* [ESLint](http://eslint.org) to maintain a consistent code style
* [multireducer](https://github.com/erikras/multireducer) to combine single reducers into one key-based reducer
* [style-loader](https://github.com/webpack/style-loader), [sass-loader](https://github.com/jtangelder/sass-loader) and [less-loader](https://github.com/webpack/less-loader) to allow import of stylesheets in plain css, sass and less,
* [stardust](https://github.com/TechnologyAdvice/stardust) The official Semantic-UI-React library
* [react-helmet](https://github.com/nfl/react-helmet) to manage title and meta tag information on both server and client
* [webpack-isomorphic-tools](https://github.com/halt-hammerzeit/webpack-isomorphic-tools) to allow require() work for statics both on client and server
* [happypack](https://github.com/amireh/happypack) Happiness in the form of faster webpack build times
* [Docker](http://www.docker.com/) docker deployment support
* [pm2](https://github.com/Unitech/pm2) Production process manager for Node.js apps with a built-in load balancer
* Table custom table component written with react (ES6 syntax).