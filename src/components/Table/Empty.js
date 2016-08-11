/**
 * Created by Grey on 16/6/17.
 */
import React, {Component, PropTypes} from 'react';

const emptyStyle = {
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: 'calc(50% - 56px)'
};
export default class Empty extends Component {
  static propTypes = {
    rowsCount: PropTypes.number
  };

  render() {
    if (this.props.rowsCount === 0) {
      return (<h1 style={emptyStyle} >暂无数据</h1>);
    } else {
      return false;
    }
  }
}
