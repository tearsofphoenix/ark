import moment from 'moment';

const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0/* first error */];

export function email(value) {
  let result = false;
  if (!isEmpty(value) && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    result = true;
  }
  return result;
}

export function required(value) {
  let result = true;
  if (isEmpty(value)) {
    result = false;
  }
  return result;
}

export function minLength(min) {
  return value => {
    let result = true;
    if (!isEmpty(value) && value.length < min) {
      result = false;
    }
    return result;
  };
}

export function maxLength(max) {
  return value => {
    let result = true;
    if (!isEmpty(value) && value.length > max) {
      result = false;
    }
    return result;
  };
}

export function integer(value) {
  let result = true;
  if (!Number.isInteger(Number(value))) {
    result = false;
  }
  return result;
}

export function oneOf(enumeration) {
  return value => {
    let result = true;
    if (!~enumeration.indexOf(value)) {
      result = false;
    }
    return result;
  };
}

export function match(field) {
  return (value, data) => {
    let result = true;
    if (data) {
      if (value !== data[field]) {
        result = false;
      }
    }
    return result;
  };
}

export function validatePersonID(id, backInfo = true) {
  const info = {
    year: 1900,
    month: 1,
    day: 1,
    sex: 'Male',
    valid: false,
    length: 0
  };
  const initDate = (length) => {
    info.length = length;
    const a = length === 15 ? 0 : 2;  // 15:18
    info.year = parseInt((a ? '' : '19') + id.substring(6, 8 + a), 10);
    info.month = parseInt(id.substring(8 + a, 10 + a), 10) - 1;
    info.day = parseInt(id.substring(10 + a, 12 + a), 10);
    info.sex = id.substring(14, 15 + a) % 2 === 0 ? 'Female' : 'Male';
    const temp = new Date(info.year, info.month, info.day);
    return (temp.getFullYear() === info.year)
      && (temp.getMonth() === info.month)
      && (temp.getDate() === info.day);
  };
  const back = () => {
    return backInfo ? info : info.valid;
  };
  if (typeof id !== 'string') return back();
  // 18
  if (/^\d{17}[0-9x]$/i.test(id)) {
    if (!initDate(18)) return back();
    id = id.toLowerCase().split('');
    const wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const y = '10x98765432'.split('');
    let sum = 0;
    for (let i = 0; i < 17; i++) sum += wi[i] * id[i];
    if (y[sum % 11] === id.pop().toLowerCase()) info.valid = true;
    return back();
  } else if (/^\d{15}$/.test(id)) {
    // 15位
    if (initDate(15)) info.valid = true;
    return back();
  } else {
    return back();
  }
}

export function createValidator(rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

const _judgeDate = (value) => moment(value).isValid();
const _judgePersonID = (value) => {
  value = value.replace(/\-|\_/g, '');
  return required(value) && validatePersonID(value, false);
};

const _judgeMobile = (value) => {
  value = value.replace(/\-|\_/g, '');
  return /^\d{11}$/.test(value);
};

const _judgeChecked = () => {
  return $(this).filter(':checked').length > 0;
};

const _judgeLength = (value, ctx) => {
  let result = false;
  if (value) {
    const length = value.length;
    if (typeof ctx === 'object') {
      const {min, max} = ctx;
      if (min) {
        if (max) {
          result = length >= min && length <= max;
        } else {
          result = length >= min;
        }
      } else {
        if (max) {
          result = length <= max;
        }
      }
    } else {
      result = length === ctx;
    }
  }
  return result;
};

const _judgeBloodPressure = (value) => {
  let result = false;
  if (value && value.length > 0) {
    const array = value.split('/');
    if (array.length === 2) {
      const high = parseInt(array[0], 10);
      const low = parseInt(array[1], 10);
      result = (Number.isInteger(high) && Number.isInteger(low) && high > low);
    }
  }
  return result;
};

export const internalValidators = {
  empty: {
    judge: required,
    message: '该项不能为空!'
  },
  checked: {
    judge: _judgeChecked,
    message: '请选择该项!'
  },
  email: {
    judge: email,
    message: '请填写正确的邮箱!'
  },
  person_id: {
    judge: _judgePersonID,
    message: '请填写正确的身份证!'
  },
  date: {
    judge: _judgeDate,
    message: '请输入正确的时间!'
  },
  mobile: {
    judge: _judgeMobile,
    message: '请输入正确的号码!'
  },
  int: {
    judge: integer,
    message: '请输入正确的数字!'
  },
  one: {
    judge: (value, ctx) => oneOf(ctx)(value),
    message: '请输入所限定的值!'
  },
  blood_pressure_pair: {
    judge: _judgeBloodPressure,
    message: '请输入正确的血压值!'
  },
  length: {
    judge: _judgeLength,
    message: (value, ctx) => {
      let message = null;
      if (typeof ctx === 'object') {
        const {min, max} = ctx;

        if (min) {
          if (max) {
            message = `长度必须在${min}与${max}之间!`;
          } else {
            message = `长度不得小于${min}!`;
          }
        } else {
          if (max) {
            message = `长度不得大于${max}!`;
          }
        }
      } else if (typeof ctx === 'number') {
        message = `长度必须为${ctx}!`;
      }
      return message;
    }
  }
};

export function validate(config, formNode, validCallback) {
  let allValid = true;
  const args = {};
  const _removeErrorOfNode = (element) => {
    element.removeClass('error');
    element.find('.ui.red.label').remove();
  };
  const _addErrorToNode = (element, error) => {
    element.addClass('error');
    const errorLabel = element.find('.ui.red.label');
    if (errorLabel.length > 0) {
      // already has error
    } else {
      element.append(`<div class="ui pointing red basic label">${error}</div>`);
    }
  };

  if (config && formNode) {
    const keys = Object.keys(config);
    if (keys && keys.length > 0) {
      // loop on each config
      //

      const _loopProcessor = (validatorConfig, key) => {
        const {judge, message, ctx, optional, parent} = validatorConfig;
        let {selector} = validatorConfig;
        // get input element by jquery
        //
        selector = selector || `input[name='${key}']`;
        let inputElement = $(formNode).find(selector);
        if (inputElement.length === 0) {
          selector = `select[name='${key}']`;
          inputElement = $(formNode).find(selector);
        }
        if (inputElement) {
          const parentElement = parent ? $(parent) : inputElement.parent();
          // add event listener to element
          //
          const listener = () => {
            const valueToJudge = inputElement.val();
            const valid = optional ? (isEmpty(valueToJudge) || judge(valueToJudge, ctx)) : judge(valueToJudge, ctx);
            if (valid) {
              _removeErrorOfNode(parentElement);
              args[key] = valueToJudge;
            }
          };
          inputElement.blur(listener);

          const valueToJudge = inputElement.val();
          const valid = optional ? (isEmpty(valueToJudge) || judge(valueToJudge, ctx)) : judge(valueToJudge, ctx);
          if (valid) {
            _removeErrorOfNode(parentElement);
            args[key] = valueToJudge;
          } else {
            allValid = false;
            let error = null;
            if (typeof message === 'string') {
              error = message;
            } else if (typeof message === 'function') {
              error = message(valueToJudge, ctx);
            }
            // display error on element
            //
            _addErrorToNode(parentElement, error);
          }
        } else {
          console.warn('[uhs:validation] missing element for', validatorConfig);
        }
      };
      for (let idx = 0; idx < keys.length; ++idx) {
        const key = keys[idx];
        let configLooper = config[key];
        if (typeof configLooper === 'string') {
          configLooper = internalValidators[configLooper];
        }

        if (Array.isArray(configLooper)) {
          configLooper.forEach((item) => _loopProcessor(item, key));
        } else {
          _loopProcessor(configLooper, key);
        }
      }
    }
  }
  if (allValid && validCallback) {
    validCallback(args);
  }
}
