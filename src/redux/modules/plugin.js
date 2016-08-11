/**
 * Created by isaac on 16/7/24.
 */
import {kPluginLoad} from '../../plugins/constants';

const initialState = {
  all: []
};

export default function (state = initialState, action = {}) {
  switch (action.type) {
    case kPluginLoad:
      const {data} = action;
      if (data) {
        let {all} = state;
        all = all.slice(0);
        all.push(data);
        return {
          ...state,
          all
        };
      }
      return state;
    default:
      return state;
  }
}
