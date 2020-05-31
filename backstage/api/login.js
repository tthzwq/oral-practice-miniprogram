const https = require('https')
const {miniprogramConfig} = require('./config.js')
const AppID = miniprogramConfig.AppID
const AppSecret = miniprogramConfig.AppSecret

/** 
 * 获取 openid
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