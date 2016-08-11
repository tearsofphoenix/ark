/**
 * Created by isaac on 3/10/16.
 */
import React, {Component, PropTypes} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import {Icon} from 'stardust';
const iconStyle = {marginRight: 0};

export default
class SideBarItem extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    icon: PropTypes.any.isRequired,
    urls: PropTypes.array
  };
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
    const {router} = this.context;
    const {urls, link, name, icon} = this.props;
    const nameStyle = {
      marginTop: '2px',
      textDecoration: 'none !important'
    };
    let currentURL = null;
    if (typeof window !== 'undefined') {
      currentURL = window.location.pathname;
    }
    let active = router.isActive(link);
    if (currentURL && urls && urls.length > 0) {
      for (let idx = 0; idx < urls.length; ++idx) {
        const url = urls[idx];
        if (currentURL.indexOf(url) === 0) {
          active = true;
          break;
        }
      }
    }
    const className = active ? 'active' : null;
    let realIcon = icon;
    if (typeof icon === 'string') {
      realIcon = (<Icon className={icon} style={iconStyle} />);
    }
    return (
      <LinkContainer to={link} >
        <li role="presentation" className={className} style={{textAlign: 'center'}} >
          <a role="menuitem" tabIndex="-1" href={link} >{realIcon}
            <div style={nameStyle} >{name}</div>
          </a>
        </li>
      </LinkContainer>
    );
  }
}
