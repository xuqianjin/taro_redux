const nopic = require("../static/image/noPicture.png");

export const changeSrc = src => {
  if (!src) {
    return "";
  }
  if (src && typeof src === "string") {
    if (
      src.indexOf("i/") === 0 ||
      src.indexOf("wxd/") === 0 ||
      src.indexOf("qruser/") === 0
    ) {
      src = CDN_URL + src;
    }
  }
  return src;
};

export const getNameByValue = (array, value) => {
  if (!array) {
    return "";
  }
  const item = array.find(item => item.value === value);
  return item.name;
};
export const countTypeText = count => {
  let text = "可以和他见面聊一聊啦";
  if (count < 3) {
    text = "认识从此刻开始,发个消息吧";
  } else if (count < 5) {
    text = "看来Ta对你挺感兴趣,电话沟通一下";
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
  return sdata.join("&");
}

export const errLog = {
  ErrVipExpired: {
    status: 400,
    message: "您的VIP已过期"
  },
  ErrInvalidWxArticle$: {
    status: 400,
    message: "请上传未上传过的微信公众号文章"
  },
  ErrModelConflict: {
    status: 400,
    message: "重复上传" // 结合接口上下文，可能是标签已已存在，文章已存在等
  },
  ErrNoPermToForcePush: {
    status: 400,
    message: "推送消息是VIP权限"
  },
  ErrVipOutdated: {
    status: 400,
    message: "您的VIP已过期"
  },
  ErrNoFormid: {
    status: 400,
    message: "推送次数为0"
  },
  ErrUseTooManyFormid: {
    status: 400,
    message: "今日该客户推送次数已达上限"
  },
  ErrInternal$: {
    status: 500,
    message: "系统异常"
  },
  ErrAlreadyOpenRedpack: {
    status: 400,
    message: "你已经领过该红包啦!"
  }
};
