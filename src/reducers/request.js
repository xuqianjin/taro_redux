import Taro from '@tarojs/taro'


function formatUrl(path, operateId) {
  if (path && operateId) path = path.replace(/\{[^\}]+\}/g, operateId)
  if (/^https?:\/\//.test(path)) {
    return path;
  } else {
    return path[0] !== '/' ? '/' + path : path;
  }
}

function formatParams(url, data) {
  if (typeof(url) == 'undefined' || url == null || url == '') {
    return '';
  }
  if (typeof(data) == 'undefined' || data == null || typeof(data) != 'object') {
    return '';
  }
  url += (url.indexOf("?") != -1) ? "" : "?";
  for (var k in data) {
    url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);
  }
  return url;
}

const methods = ['get', 'post', 'put', 'delete'];
let request = {}

methods.forEach(method => {
  request[method] = (path, {
    operateId,
    header,
    params,
    data,
  } = {}) => {
    var url = ''
    if (path) {
      url = formatUrl(path, operateId)
    }
    if (params) {
      url = formatParams(url, params)
    }
    const postdata = {
      method: method.toUpperCase(),
      url,
      header,
      data,
    }
    return Taro.request(postdata)
  }
});

export default request;