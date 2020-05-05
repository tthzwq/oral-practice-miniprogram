// pages/home/home.js
import { getOpenid, checkOpenid } from '../../network/login.js'
const App = getApp()
Page({
  data: {
    login: false,
    sayHello: '未登录1',
    clock: 0,
    userInfo: '',
    bindInfo: '',
    openid: ''
  },
  onReady: function() {
  },
  onShow:function() {
    let dataNow = new Date().getHours()
    let message = ''
    if (dataNow < 5) {message = '夜深了'}
    else if (dataNow < 9) {message = "早上好"}
    else if (dataNow < 12) {message = "上午好"}
    else if (dataNow < 14) {message = "中午好"}
    else if (dataNow < 19) {message = "下午好"}
    else if (dataNow < 22) {message = "晚上好"}
    else {message = "夜深了"}
    this.setData({
      sayHello: message,
      openid: App.globalData.openid,
      login: App.globalData.login,
      userInfo: App.globalData.userInfo,
      bindInfo: App.globalData.bindInfo
    })
    if(this.data.userInfo == false) {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo'] == true) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: resove => {
                // 可以将 resove 发送给后台解码出 unionId
                App.globalData.userInfo = resove.userInfo
                App.globalData.login = true
                this.setData({
                  login: true,
                  userInfo: resove.userInfo
                })
                wx.setStorage({
                  data: resove.userInfo,
                  key: 'userInfo',
                })
              }
            })
          }
        }
      })
    }
    if(this.data.bindInfo == '') {
      if(this.data.openid == '') {
        wx.login({
          success: res => {
            getOpenid(res.code).then(openid => {
              checkOpenid(openid).then(res => {
                if(res.bind) {
                  this.setData({
                    clock:res.data.clock.length
                  })
                }
                this.setData({
                  bindInfo: res
                })
                App.globalData.bindInfo = res
                wx.setStorage({
                  data: res,
                  key: 'bindInfo'
                })
              })
              App.globalData.openid = openid
              this.setData({openid: openid})
              wx.setStorage({
                data: openid,
                key: 'openid'
              })
            })
          }
        })
      }else {
        checkOpenid(this.data.openid).then(res => {
          if(res.bind) {
            this.setData({
              clock:res.data.clock.length
            })
          }
          this.setData({
            bindInfo: res
          })
          App.globalData.bindInfo = res
          wx.setStorage({
            data: res,
            key: 'bindInfo'
          })
        })
      }
    }else if (App.globalData.bindInfo.bind) {
      this.setData({
        clock:App.globalData.bindInfo.data.clock.length,
      })
    }
  },
  switchTab:function() {wx.switchTab({url: '/pages/profile/profile'})},
  
})
