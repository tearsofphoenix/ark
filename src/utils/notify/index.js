/**
 * Created by isaac on 16/7/4.
 */
const observers = {};

export function addObserver(name, func) {
  if (name && func) {
    let pool = observers[name];
    if (!pool) {
      pool = [];
    }
    pool.push(func);
    observers[name] = pool;
  }
}

export function removeObserver(func) {
  Object.keys(observers).forEach((key) => {
    const pool = observers[key];
    const idx = pool.indexOf(func);
    if (idx !== -1) {
      pool.splice(idx, 1);
    }
  });
}

export function notify(name, args) {
  if (name) {
    const pool = observers[name];
    if (pool) {
      pool.forEach((func) => func(args));
    }
  }
}

export function dispatchNotify(data) {
  const {name, args} = data;
  notify(name, args);
}
