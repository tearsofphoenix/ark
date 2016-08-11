import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import Helmet from 'react-helmet';
import {LoadingPage} from 'components';

function fixURL(url) {
  let result = url;
  if (__DEVELOPMENT__) {
    result = url.replace('3000', '3001').replace('main-dll.js', 'app.js');
  }
  return result;
}

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
    plugins: PropTypes.array
  };
  static childContextTypes = {
    plugins: PropTypes.array
  };

  getChildContext() {
    return {plugins: this.props.plugins};
  }

  _renderPlugins = () => {
    const {plugins} = this.props;
    let result = null;
    if (plugins && plugins.length > 0) {
      let src = '/dist/plugins/index-prod.min.js';
      if (__DEVELOPMENT__) {
        src = '/dist/plugins/index.min.js';
      }
      result = (<script src={src} charSet="UTF-8" />);
    }
    return result;
  };

  render() {
    const {assets: {styles, javascript}, component, store} = this.props;
    const {vendor, main} = javascript;
    const content = component ? ReactDOM.renderToString(component) : '';
    const head = Helmet.rewind();
    return (
      <html lang="zh-cn" >
      <head>
        <meta charSet="utf-8" />
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* styles (will be present only in production with webpack extract text plugin) */}
        {Object.keys(styles).map((style, key) =>
          <link href={styles[style]} key={key} media="screen, projection"
                rel="stylesheet" type="text/css" charSet="UTF-8" />
        )}

      </head>
      <body>
      <LoadingPage />
      <div id="content" dangerouslySetInnerHTML={{__html: content}} />
      <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8" />
      {vendor && <script src={vendor} charSet="UTF-8" />}
      <script src={fixURL(main)} charSet="UTF-8" />
      {this._renderPlugins()}
      </body>
      </html>
    );
  }
}
