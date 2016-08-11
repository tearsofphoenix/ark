import React, {Component, PropTypes} from 'react';

const wrapper = {
  display: 'inline-block',
  width: '100%',
  position: 'relative',
  marginBottom: '10px'
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  paddingRight: '47px',
  padding: '11px 23px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  outline: 'none'
};

const iconStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: '10px'
};
const iconClearStyle = {
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  right: '10px',
  fontSize: '18px',
  color: '#aaa'
};
export default
class SearchView extends Component {
  static propTypes = {
    searchCallback: PropTypes.func,
    searchResetCallback: PropTypes.func,
    placeholder: PropTypes.string
  };

  state = {
    input: ''
  };

  search = () => {
    const {input} = this.state;
    const {searchCallback, searchResetCallback} = this.props;
    if (input && input.length > 0) {
      if (searchCallback) {
        searchCallback(input);
      }
    } else {
      if (searchResetCallback) {
        searchResetCallback();
      }
    }
  };

  handleClear = (event) => {
    event.preventDefault();
    const {searchResetCallback} = this.props;
    if (searchResetCallback) {
      searchResetCallback();
      this.setState({
        input: ''
      });
    }
  };

  _onChange = (event) => {
    this.setState({
      input: event.currentTarget.value
    });
  };

  _onKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.search();
      return false;
    }
    return true;
  };
  _search = (event) => {
    event.preventDefault();
    this.search();
  };

  _renderSearch() {
    return (<div style={iconStyle} onClick={this._search} >
      <i className="search icon" />
    </div>);
  }

  _renderClear() {
    return (<div style={iconClearStyle} onClick={this.handleClear} >
      <i className="remove circle icon" ></i>
    </div>);
  }

  render() {
    const {placeholder} = this.props;
    const {input} = this.state;
    return (
      <div style={wrapper} >
        <input type="search" placeholder={placeholder} style={inputStyle} onKeyDown={this._onKeyDown} value={input}
               onChange={this._onChange} />
        {!input && this._renderSearch() || this._renderClear()}
      </div>);
  }
}
