import {baseURL} from './config.js'
import { post } from './promise.js'

/**
 * 获取token
 * @returns {Promise} 返回Promise实例
*/
export function getOpenid (code) {
  return new Promise((resove, reject) => {
    post({
      url: baseURL + '/openid',
      data: {
        code: code
      },
      header: {
        "chennel":"miniprogram"
      }
    }).then(res => {
      if (res.errocde && res.errocde != 0) {
        reject(res)
        return
      }
      resove(res)
    }).catch( err => {
      reject(err)
    })
  })
}
