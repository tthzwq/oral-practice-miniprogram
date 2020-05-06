//logs.js
const {formatTime} = require('../../utils/util.js')
const App = getApp()
import {punch} from '../../network/login.js'
import { $wuxCalendar } from '../../components/wux-weapp/index.js'


Page({
  data: {
    bindInfo: '',
    userInfo: '',
    clock: 0,
    value2: [],
    logs: []
  },
  onLoad: function () {
    if (! App.globalData.bindInfo.bind) {
      wx.showToast({
        title: '请先认证身份',
        icon: "none"
      })
      return
    }
    const day = formatTime(new Date())
    if(App.globalData.bindInfo.data.clock[App.globalData.bindInfo.data.clock.length - 1] == day) {
      wx.showToast({
        title: '今日已签到',
        icon: "none"
      })
      this.show()
    }else {
      if(App.globalData.openid) {
        punch(App.globalData.openid).then(res => {
          if (res.code == 0) {
            wx.showToast({
              title: '签到成功',
            })
            App.globalData.bindInfo.data = res.data
            this.show()
            wx.setStorage({
              data: App.globalData.bindInfo,
              key: 'bindInfo',
            })
          }
        })
      }
    }
  },
  show:function() {
    this.setData({
      bindInfo: App.globalData.bindInfo,
      userInfo: App.globalData.userInfo,
      logs: App.globalData.bindInfo.data.clock,
      clock: App.globalData.bindInfo.data.clock.length
    })
    $wuxCalendar().open({
      value: this.data.logs,
      multiple: true,
      onChange: (values, displayValues) => {
        // console.log('onChange', values, displayValues)
        this.setData({
            value2: displayValues,
        })
      },
    })
  }
})
