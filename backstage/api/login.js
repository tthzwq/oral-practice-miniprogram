const https = require('https')
const AppID = 'wx487727c97b99efc7'
const AppSecret = '4cb31aa19a720569e1a237f33dcd5743'

/** 
 * @param {String} code  临时登录凭证 code  必填
 */
module.exports.getOpenid = function(code) {
  
  return new Promise((resolve, reject) => {
    let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${ AppID }&secret=${ AppSecret }&js_code=${ code }&grant_type=authorization_code`
    grant_type='authorization_code'
    https.get(url, (res) => {
      res.setEncoding('utf-8')
      // console.log('状态码:', res.statusCode);
      // console.log('请求头:', res.headers);
      res.on('data', (data) => {
        resolve(JSON.parse(data))
      })
    }).on('error', (err) => {
      reject(err);
    })
  })
}