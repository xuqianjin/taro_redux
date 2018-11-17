import Taro, {
  Component
} from '@tarojs/taro'

const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');

const uploadFile = function(env, filePath, successCB, errorCB) {

  const expiration = env.Expiration
  const accessid = env.accessid;
  const accesskey = env.accesskey
  const ststoken = env.ststoken

  const aliyunServerURL = env.aliyunServerURL;
  const policyBase64 = getPolicyBase64(expiration);
  const signature = getSignature(policyBase64, accesskey);
  const aliyunFileKey = env.aliyunFileKey

  let formData = {
    'key': aliyunFileKey,
    'OSSAccessKeyId': accessid,
    'policy': policyBase64,
    'Signature': signature,
    'success_action_status': '200',
    'x-oss-security-token': ststoken
  }
  return Taro.uploadFile({
    url: aliyunServerURL,
    filePath: filePath,
    name: 'file',
    formData: formData,
  }).then(res => {
    if (res.path = aliyunFileKey)
      return res
  })
}

const getPolicyBase64 = function(expiration) {
  const policyText = {
    "expiration": expiration, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 指定了Post请求必须发生在2020年01月01日12点之前("2020-01-01T12:00:00.000Z")。
    "conditions": [
      [
        "content-length-range", 0, 1048576000
      ]
    ]
  };

  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  return policyBase64;
}

const getSignature = function(policyBase64, accesskey) {

  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
    asBytes: true
  });
  const signature = Crypto.util.bytesToBase64(bytes);

  return signature;
}

module.exports = uploadFile;