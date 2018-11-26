const nopic = require("../static/image/noPicture.png");

export const changeSrc = src => {
  if (!src) {
    return nopic;
  }
  if (src && typeof src === "string") {
    if (src.indexOf("i/") === 0) {
      src = CDN_URL + src;
    }
  }
  return src;
};

export const countTypeText = count => {
  let text = "可以和他见面聊一聊啦";
  if (count < 3) {
    text = ",认识从此刻开始,发个消息吧";
  } else if (count < 5) {
    text = "看来Ta对你挺感兴趣,可以电话沟通一下";
  }
  return text;
};

/**
 * 拼接对象为请求字符串
 * @param {Object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
export function encodeSearchParams(paramObj) {
  const sdata = [];
  for (let attr in paramObj) {
    sdata.push(`${attr}=${paramObj[attr]}`);
  }
  return sdata.join('&');
}
