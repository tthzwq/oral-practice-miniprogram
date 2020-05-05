import { checkOpenid } from '../../network/login'
const App = getApp()
Page({
  data: {
    openid: '',
    binding: 'loading',
    bindInfo: {},
    userInfo: {},
    github: [{
      icon: '/assets/image/github.svg',
      title: 'GitHub',
      message: '源码地址',
      type: 'address'
    }],
    cells: [
      {
        icon: '/assets/image/info.svg',
        title: '个人信息',
        message: '',
        type: 'info'
      },
      {
        icon: '/assets/image/class.svg',
        title: '班级任务',
        message: '',
        type: 'class'
      },
    ],
    students: [
      {
        icon: '/assets/image/students.svg',
        title: '学生信息',
        message: '学生学习进度',
        type: 'student'
      }
    ]
  },
  onLoad: function () {
    this.setData({
      openid: App.globalData.openid
    })
    if(App.globalData.userInfo == ''){
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo'] == true) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: resove => {
                // 可以将 res 发送给后台解码出 unionId
                App.globalData.userInfo = resove.userInfo
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
    }else {
      this.setData({
        userInfo: App.globalData.userInfo
      })
    }
    this.getUserInfo()
  },
  onShow: function() {
    this.setData({
      binding: "loading"
    })
    wx.getStorage({
      key: 'bindInfo',
      success:res => {
        this.setData({
          binding: res.data.bind,
          bindInfo: res.data
        })
      },
      fail:() => {
        checkOpenid(this.data.openid).then(res => {
          this.setData({
            binding: res.bind,
            bindInfo: res.data
          })
          wx.setStorage({
            data: res,
            key: 'bindInfo'
          })
        })
      }
    })
  },
  onGotUserInfo: function(e) { //用户手动授权登录
    if(e.detail.userInfo) {
      App.globalData.login = true
      App.globalData.userInfo = e.detail.userInfo
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
    App.globalData.login = false
    App.globalData.userInfo = ''
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
          App.globalData.login = false
          App.globalData.userInfo = ''
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
          App.globalData.login = false
          App.globalData.userInfo = ''
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
                        App.globalData.login = true
                        App.globalData.userInfo = data.userInfo
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
                  App.globalData.login = false
                  App.globalData.userInfo = ''
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
  address: function () { // GitHub地址
    wx.setClipboardData({
      data: 'https://github.com/TThz-hz/oral-practice-miniprogram',
    })
  },
  info: function() { // 个人信息
    wx.navigateTo({
      url: '/pages/info/info',
    })
  },
  class: function() { // 班级任务
    wx.navigateTo({
      url: '/pages/task/task?classId=' + this.data.bindInfo.data.classId,
    })
  },
  student: function() { // 学生学习进度
    wx.navigateTo({
      url: '/pages/students/students?classId='+this.data.bindInfo.data.classId,
    })
  },
  getIntegral: function () {  // 获取积分
    console.log("获取积分")
  },
  certification: function () { // 身份认证
    if(this.data.binding == 'loading') {
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