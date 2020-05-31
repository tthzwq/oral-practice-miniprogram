import { getOpenid, checkOpenid } from './network/login.js'

//app.js
App({
  onLaunch: function () {
    wx.getStorage({
      key: 'login',
      success:(res)=> {
        this.globalData.login = res.data
      }
    })
    this.FileSystem.mkdir({dirPath: wx.env.USER_DATA_PATH +'/tts'})
    this.FileSystem.mkdir({dirPath: wx.env.USER_DATA_PATH +'/video'})
    // 设置 InnerAudioContext 的播放选项 全局生效 终止其他应用或微信内的音乐
    wx.setInnerAudioOption({mixWithOther: false})

    wx.getStorage({
      key: 'openid',
      success:(resove) => {
        wx.checkSession({
          success: ()=>{
            this.globalData.openid = resove.data
            this.checkBind(resove.data)
          },
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
              this.globalData.userInfo = res.userInfo
              this.globalData.login = true
              wx.setStorage({
                key: 'login',
                data: true
              })
              wx.setStorage({
                data: res.userInfo,
                key: 'userInfo',
              })
            }
          })
        } else {
          this.globalData.login = false
          this.globalData.userInfo = ''
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
          this.globalData.openid = openid
          this.checkBind(openid)
          wx.setStorage({
            data: openid,
            key: 'openid',
          })
        })
      }
    })
  },
  // 获取用户绑定信息
  checkBind: function(openid) {
    checkOpenid(openid).then(res => {
      this.globalData.bindInfo = res
      wx.setStorage({
        data: res,
        key: 'bindInfo'
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
  globalData: {
    login: false,
    openid: '',
    userInfo: '',
    bindInfo: ''
  },
  /** 全局唯一录音管理器 */
  Recorder: wx.getRecorderManager(),
  /** 全局唯一的文件管理器 */
  FileSystem: wx.getFileSystemManager()
})