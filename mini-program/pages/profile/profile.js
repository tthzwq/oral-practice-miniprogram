const App = getApp()
Page({
  data: {
    binding: 0,
    userInfo: {},
    cells: [
      {
        icon: '/assets/image/github.svg',
        title: 'GitHub',
        message: '源码地址',
        type: 'address'
      }
    ]
  },
  onLoad: function () {
    wx.getStorage({
      key: 'userInfo',
      success:res => {
        this.setData({
          userInfo: res.data
        })
      },
      fail: () => {
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo'] == true) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: resove => {
                  // 可以将 res 发送给后台解码出 unionId
                  wx.setStorage({
                    data: resove.userInfo,
                    key: 'userInfo',
                  })
                  this.setData({
                    userInfo: resove.userInfo
                  })
                }
              })
            }
          }
        })
      }
    })
    wx.getStorage({
      key: 'bindInfo',
      success: (res) => {
        this.setData({
          binding: res.data.bind
        })
      },
      fail: () => {
        wx.getStorage({
          key: 'openid',
          success: res => {
            App.checkBind(res.data,()=> {
              wx.getStorage({
                key: 'bindInfo',
                success:res=> {
                  this.setData({
                    binding: res.data.bind
                  })
                }
              })
            })
          }
        })
      }
    })
    this.getUserInfo()
  },
  onGotUserInfo: function(e) {
    if(e.detail.userInfo) {
      wx.setStorage({
        data: e.detail.userInfo,
        key: 'userInfo',
      })
      wx.setStorage({
        key: 'login',
        data: true
      })
      this.setData({
        userInfo: e.detail.userInfo,
      })
      return
    }
    wx.setStorage({
      key: 'login',
      data: false
    })
    wx.removeStorageSync("userInfo")
    this.setData({
      userInfo: {}
    })
    this.getUserInfo()
  },
  getUserInfo: function () { // 获取用户头像等信息
    wx.getSetting({
      complete: (res) => {
        if (! res.authSetting['scope.userInfo']) {
          wx.setStorage({
            key: 'login',
            data: false
          })
          wx.removeStorageSync("userInfo")
          this.setData({
            userInfo: {}
          })
        }
        if (res.authSetting['scope.userInfo'] == false) {
          wx.setStorage({
            key: 'login',
            data: false
          })
          wx.removeStorageSync("userInfo")
          wx.showModal({
            showCancel: false,
            confirmText: '去授权',
            content: '请授权使用你的公开信息，否则你将无法使用某些功能',
            success:() => {
              wx.openSetting({
                withSubscriptions: true,
                success: (resove) => {
                  if (resove.authSetting['scope.userInfo'] === true) {
                    wx.getUserInfo({
                      success: data => {
                        wx.setStorage({
                          data: data.userInfo,
                          key: 'userInfo',
                        })
                        wx.setStorage({
                          key: 'login',
                          data: true
                        })
                        this.setData({
                          userInfo: data.userInfo
                        })
                      }
                    })
                    return
                  }
                  wx.setStorage({
                    key: 'login',
                    data: false
                  })
                  wx.removeStorageSync("userInfo")
                  this.setData({
                    userInfo: {}
                  })
                  wx.switchTab({
                    url: '/pages/profile/profile'
                  })
                }
              })
            }
          })
        }
      },
    })
  },
  address: function () {
    wx.setClipboardData({
      data: 'https://github.com/TThz-hz/oral-practice-miniprogram',
    })
  },
  getIntegral: function () {  //获取积分
    console.log("获取积分")
  },
  certification: function () { //身份认证
    if(this.data.binding == 0) {
      wx.showToast({
        title: '数据请求中，请稍后',
        icon: "none"
      })
    }
    if(this.data.binding == false) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    if(this.data.binding == true) {
      wx.showToast({
        title: '已认证',
      })
    }
  }
})