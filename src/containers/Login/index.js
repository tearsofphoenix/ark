import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Button} from 'stardust';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import CryptoJS from 'crypto-js';
import * as authActions from 'redux/modules/auth';
import {validate} from 'utils/validation';
import {Form, Input} from 'stardust';

@connect(
  state => ({
    user: state.auth.user,
    loginError: state.auth.error
  }),
  {
    ...authActions
  })
export default
class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    loginError: PropTypes.string
  };
  state = this.state = {
    email: '',
    password: ''
  };

  _handleOnLogin = () => {
    const node = ReactDOM.findDOMNode(this.refs.formValidation);
    validate({
      email: 'email',
      password: 'empty'
    }, node, () => {
      const {email, password} = this.state;
      const sha1 = CryptoJS.SHA1;
      this.props.login(email, sha1(password).toString().toUpperCase(), '');
    });
  };

  _onChange = (event) => {
    const {name, value} = event.target;
    const newState = {...this.state};
    newState[name] = value;
    this.setState(newState);
  };

  _renderLeftPart = (styles) => {
    return (<div className={styles.left} ></div>);
  };

  render() {
    const {user} = this.props;
    const {email, password} = this.state;
    const styles = require('./Login.scss');
    return (
      <div className={styles.loginPage}>
        <Helmet title="Login" />
        {!user && this._renderLeftPart(styles)}
        {!user && <div className={styles.formWrapper} >
          <form className="ui form" ref="formValidation" >
            <h3 style={{textAlign: 'center'}} >Login</h3>
            <Form.Field>
              <Input type="text" value={email} name="email" placeholder="Email" onChange={this._onChange} />
            </Form.Field>
            <Form.Field>
              <Input type="password" value={password} name="password" placeholder="Password" onChange={this._onChange} />
            </Form.Field>
            <Form.Field>
              <Button className="fluid primary" onClick={this._handleOnLogin} >Login</Button>
            </Form.Field>
          </form>
        </div>
        }
      </div>
    );
  }
}
