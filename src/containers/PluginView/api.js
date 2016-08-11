/**
 * Created by isaac on 16/7/18.
 */

import superagent from 'superagent';

export function listPlugins(params) {
  return new Promise((resolve, reject) => {
    const request = superagent.get('/plugin/list');
    request.query(params);
    request.end((err, {body} = {}) => err ? reject(body || err) : resolve(body));
  });
}

export function deletePlugin(data) {
  return new Promise((resolve, reject) => {
    const request = superagent.post('/plugin/remove');
    request.send(data);
    request.end((err, {body} = {}) => err ? reject(body || err) : resolve(body));
  });
}
