import { getOpenid, checkOpenid } from './network/login.js'

//app.js
App({
  onLaunch: function () {
    this.FileSystem.mkdir({dirPath: wx.env.USER_DATA_PATH +'/tts'})

    // 设置 InnerAudioContext 的播放选项 全局生效 终止其他应用或微信内的音乐
    wx.setInnerAudioOption({mixWithOther: false})

    wx.getStorage({
      key: 'openid',
      success:(res) => {
        wx.getStorage({
          key: 'bindInfo',
          fail: () => {
            this.checkBind(res.data)
          }
        })
        wx.checkSession({
          fail:() => {
            this.login()
          }
        })
      },
      fail:() => {
        this.login()
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] == true) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              wx.setStorage({
                data: res.userInfo,
                key: 'userInfo',
              })
            }
          })
        } else {
          wx.removeStorage({key:"userInfo"})
          wx.setStorage({
            key: 'login',
            data: false
          })
        }
      }
    })
  },
  // 获取openid
  login: function() {
    wx.login({
      success: res => {
        getOpenid(res.code).then(openid => {
          this.checkBind(openid)
          wx.setStorage({
            data: openid,
            key: 'openid',
          })
        }).catch(err => {
          console.log(err)
        })
      }
    })
  },
  // 获取用户绑定信息
  checkBind: function(openid, callback) {
    checkOpenid(openid).then(res => {
      wx.setStorage({
        data: res,
        key: 'bindInfo',
        success: ()=> {
          if(callback) {
            callback()
          }
        }
      })
    })
  },
  getRecordingAuthorize: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.record'] === false) {
          wx.showModal({
            showCancel: false,
            confirmText: '去授权',
            content: '请允许使用录音权限，否则你将无法使用此功能',
            success() {
              wx.openSetting({
                withSubscriptions: true,
                success: (resove) => {
                  if (resove.authSetting['scope.record'] === false) {
                    wx.switchTab({
                      url: '/pages/home/home'
                    })
                  }
                }
              })
            }
          })
        }
      }
    })
  },
  // globalData: {
  // },
  /** 全局唯一录音管理器 */
  Recorder: wx.getRecorderManager(),
  /** 全局唯一的文件管理器 */
  FileSystem: wx.getFileSystemManager()
})