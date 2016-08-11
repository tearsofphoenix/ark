/**
 * Created by yons on 16/3/13.
 */

export function getPageCount(length, pageSize) {
  return parseInt(Math.ceil(length / pageSize), 10);
}

export function randomString() {
  const time = new Date().getTime();
  const suffix = Math.random().toString(36).substring(5);
  return `${time}-${suffix}`;
}
