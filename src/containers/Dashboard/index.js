/**
 * Created by isaac on 2016/4/4.
 */
import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default
class Dashboard extends Component {
  render() {
    const name = 'Blah blah ...';
    return (
      <div>
        <Helmet title={name} />
        {name}
      </div>
    );
  }
}
