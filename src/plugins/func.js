/**
 * Created by isaac on 16/8/8.
 */

export function arrayToImage(array) {
  const arrayBufferView = new Uint8Array(array);
  const blob = new Blob([arrayBufferView], {type: 'image/jpeg'});
  const urlCreator = window.URL || window.webkitURL;
  return urlCreator.createObjectURL(blob);
}
