/**
 * Created by isaac on 16/7/24.
 */
import React, {Component, PropTypes} from 'react';
import NotFound from '../NotFound';
import {connect} from 'react-redux';

@connect(
  state => ({plugins: state.plugin.all}),
  {}
)
export default
class DynamicComponent extends Component {
  static propTypes = {
    plugins: PropTypes.array
  };

  render() {
    let ElementClass = null;
    let currentURL = null;
    if (typeof window !== 'undefined') {
      currentURL = window.location.pathname;
    }
    const {plugins, ...rest} = this.props;
    if (plugins && plugins.length > 0) {
      for (let idx = 0; idx < plugins.length; ++idx) {
        const {component, config: {anchors: {url}}} = plugins[idx];
        if (url === currentURL) {
          ElementClass = component;
          break;
        }
      }
    }
    let result = null;
    if (ElementClass) {
      result = (<ElementClass {...rest} />);
    } else {
      result = (<NotFound />);
    }
    return result;
  }
}
