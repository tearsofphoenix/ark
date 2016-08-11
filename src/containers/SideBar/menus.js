/**
 * Created by yons on 16/4/6.
 */
import React from 'react';
import {Icon} from 'stardust';
const style = {marginRight: 0};

export default [
  {
    header: 'S1',
    menus: [
      {
        icon: <Icon className="dashboard big" style={style} />,
        link: '/dashboard',
        name: 'Dash'
      }
    ]
  },
  {
    header: 'S2',
    menus: [
      {
        icon: <Icon className="server big" style={style} />,
        link: '/plugins',
        name: 'Plugins'
      }
    ]
  }
];
