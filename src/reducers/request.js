import Taro from "@tarojs/taro";
import { errLog } from "../lib/utils";

function formatUrl(path, operateId) {
  if (path && operateId) path = path.replace(/\{[^\}]+\}/g, operateId);
  if (/^https?:\/\//.test(path)) {
    return path;
  } else {
    return path[0] !== "/" ? "/" + path : path;
  }
}

function formatParams(url, data) {
  if (typeof url == "undefined" || url == null || url == "") {
    return "";
  }
  if (typeof data == "undefined" || data == null || typeof data != "object") {
    return "";
  }
  url += url.indexOf("?") != -1 ? "" : "?";
  for (var k in data) {
    url += (url.indexOf("=") != -1 ? "&" : "") + k + "=" + encodeURI(data[k]);
  }
  return url;
}

const methods = ["get", "post", "put", "delete"];
let request = {};

methods.forEach(method => {
  request[method] = (path, { operateId, header, params, data } = {}) => {
    var url = "";
    if (path) {
      url = formatUrl(path, operateId);
    }
    if (params) {
      url = formatParams(url, params);
    }

    if (header && header.Authorization) {
      header.Authorization = "Bearer " + header.Authorization;
    }
    const postdata = {
      method: method.toUpperCase(),
      url,
      header,
      data
    };
    return new Promise((resolve, reject) => {
      Taro.request(postdata)
        .then(res => {
          if (res.statusCode >= 400) {
            const errmsg = Object.assign(
              {},
              res.data,
              errLog[res.data.code] || {}
            );
            reject(errmsg);
          }
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    });
  };
});

export default request;
