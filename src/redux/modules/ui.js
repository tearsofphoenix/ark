/**
 * Created by isaac on 2/26/16.
 */

const OPEN_MODAL = 'uhs/ui/OPEN_MODAL';
const CLOSE_MODAL = 'uhs/ui/CLOSE_MODAL';

const OPEN_ALERT = 'uhs/ui/OPEN_ALERT';
const CLOSE_ALERT = 'uhs/ui/CLOSE_ALERT';

const UPDATE_TABINDEX = 'uhs/ui/UPDATE_TABINDEX';

const SEARCH = 'uhs/ui/SEARCH';
const SEARCH_OK = 'uhs/ui/SEARCH_OK';
const SEARCH_FAIL = 'uhs/ui/SEARCH_FAIL';

const initialState = {
  isModalOpen: false,
  isAlertShow: false,
  alertContext: {},
  showNavBar: false,
  showSideBar: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case OPEN_MODAL:
      return {
        ...state,
        isModalOpen: true,
        componentCreator: action.componentCreator
      };
    case CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
        componentCreator: () => {
          return null;
        }
      };
    case OPEN_ALERT:
      return {
        ...state,
        alertContext: action.params,
        isAlertShow: true
      };
    case CLOSE_ALERT:
      return {
        ...state,
        alertContext: {},
        isAlertShow: false
      };
    case UPDATE_TABINDEX:
      return {
        ...state,
        tabIndex: action.tabIndex
      };
    default:
      return state;
  }
}

export function openModal(componentCreator) {
  return {
    type: OPEN_MODAL,
    componentCreator
  };
}

export function closeModal() {
  return {type: CLOSE_MODAL};
}

export function openAlert(params) {
  return {type: OPEN_ALERT, params};
}

export function updateTabIndex(tabIndex) {
  return {type: UPDATE_TABINDEX, tabIndex};
}

export function closeAlert() {
  if (typeof document !== 'undefined') {
    let element = document.getElementsByClassName('sweet-overlay')[0];
    if (element) {
      element.parentNode.removeChild(element);
    }
    element = document.getElementsByClassName('sweet-alert')[0];
    if (element) {
      element.parentNode.removeChild(element);
    }
  }
  return {type: CLOSE_ALERT};
}

export function search(url, params, callback) {
  return (dispatch) => {
    dispatch({
      types: [SEARCH, SEARCH_OK, SEARCH_FAIL],
      promise: (client, ctx) => client.get(url, {...ctx, params})
    }).then(callback);
  };
}
