/**
 * 发起get请求
 * @param url 请求路径 必填
 * @param data 请求参数 get请求的参数会自动拼到地址后面
 * @param header 请求头 选填
 * @returns {Promise} Promise
*/
export const get = ({ url, data, header }) => request({method:'GET', url, data, header});

/**
 * 发起post请求
 * @param url  请求路径 必填
 * @param data 请求参数
 * @param header 请求头 选填
 * @returns {Promise} Promise
*/
export const post = ({ url, data, header }) => request({ method:'POST', url, data, header});

/**
 * 接口请求基类方法
 * @param method 请求方法 必填
 * @param url 请求路径 必填
 * @param data 请求参数
 * @param header 请求头 选填
 * @returns {Promise} Promise
*/
export function request({method, url, data, header}) {
  wx.showNavigationBarLoading()
  return new Promise((resolve, reject) => {
    const response = {};
    wx.request({
      url,
      method,
      data,
      header,
      success: res => response.success = res,
      fail: error => response.fail = error,
      complete() {
        wx.hideNavigationBarLoading()
        if (response.success) {
          if (response.success.statusCode != 200) {
            wx.showToast({
              title: "网络出错，稍后再试",
              icon: "none"
            });
            return;
          }
          resolve(response.success.data);
        } else {
          wx.showToast({
            title: "数据请求失败，请稍后重试",
            icon: "none"
          });
          console.log('数据请求失败', response.fail)
          reject(response.fail);
        }
      },
    })
  })
}