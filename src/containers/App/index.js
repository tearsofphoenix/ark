import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import {push, replace} from 'react-router-redux';
import config from '../../config';
import {NavBar, SideBar} from 'containers';
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth';

import Login from '../Login';

import {asyncConnect} from 'redux-connect';

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()));
    }
    return Promise.all(promises);
  }
}])
@connect(
  state => ({
    user: state.auth.user
  }),
  {
    pushState: push, replace
  })
export default class App extends Component {
  static propTypes = {
    store: PropTypes.object,
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired
  };

  componentDidMount() {
    if (typeof document !== 'undefined') {
      document.body.className += ' loaded';
      setTimeout(() => {
        const elements = document.getElementsByClassName('ark_loader_wrapper');
        const item = elements[0];
        item.parentNode.removeChild(item);
      }, 700);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // has login
      this.props.pushState('/dashboard');
    } else if (this.props.user && !nextProps.user) {
      // redirect to login page
      this.props.replace('/');
    }
  }

  renderWithUser() {
    const appContentStyle = {
      height: '100%',
      width: '100%',
      whiteSpace: 'nowrap'
    };
    const mainStyle = {
      width: '100%',
      boxSizing: 'border-box',
      display: 'inline-block',
      height: '100%',
      fontSize: '14px',
      whiteSpace: 'normal',
      paddingLeft: '70px',
      marginLeft: '-70px',
      backgroundColor: '#FDFDFD'
    };
    return (<div style={appContentStyle} >
      <SideBar />
      <div style={mainStyle} >
        <NavBar />
        {this.props.children}
      </div>
    </div>);
  }

  render() {
    const appStyle = {
      position: 'absolute',
      boxSizing: 'border-box',
      width: '100%',
      minHeight: '100%',
      boxShadow: '0 3px 20px #000',
      backgroundClip: 'content-box',
      height: '100%',
      overflow: 'hidden',
      zIndex: 0
    };
    const {user} = this.props;
    const content = user ? this.renderWithUser() : <Login />;
    return (
      <div style={appStyle} >
        <Helmet {...config.app.head} />
        {content}
      </div>
    );
  }
}
