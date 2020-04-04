import { promisifyAll, promisify } from 'miniprogram-api-promise';

const wxp = {}
// promisify all wx's api
promisifyAll(wx, wxp)

// promisify single api
// promisify(wx.getSystemInfo)().then(console.log)

//app.js
App({
  onLaunch: function () {
    this.FileSystem.mkdir({dirPath: wx.env.USER_DATA_PATH +'/tts'})
    // this.FileSystem.access({
    //   path: wx.env.USER_DATA_PATH +'/tts',
    //   complete: (res) => console.log(res)
    // })
    // 设置 InnerAudioContext 的播放选项 全局生效 终止其他应用或微信内的音乐
    // wx.setInnerAudioOption({mixWithOther: false})

    // console.log(wx.getSystemInfoSync())
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        // console.log(res)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  /** 全局唯一录音管理器 */
  Recorder: wx.getRecorderManager(),
  /** 全局唯一的文件管理器 */
  FileSystem: wx.getFileSystemManager()
})