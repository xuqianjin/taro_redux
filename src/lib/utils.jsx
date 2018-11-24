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
