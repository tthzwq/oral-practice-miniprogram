const plugin = requirePlugin("WechatSI")
/** 获取全局唯一的语音识别管理器 */
const manager = plugin.getRecordRecognitionManager()
Page({
  data: {
    text: ''
  },
  tap() { //短击 录音时间过短
    wx.showToast({
      title: "录音时间过短",
      icon: "none",
      duration: 500
    })
  },
  longstart() { //长按开始录音
    wx.vibrateShort()
    manager.start()
  },
  touchend() { //结束录音
    manager.stop()
  },
  touchbreak() { //录音被打断
    wx.showToast({
      title: "录音被打断",
      image: '/assets/luoxiaohei/lei.gif'
    })
  },
  onReady: function () {
    manager.onRecognize = res => { //有新的识别内容返回，则会调用此事件
      this.setData({
        text: res.result
      })
    }
    manager.onStop = res => {
      this.setData({
        text: res.result
      })
    }
    manager.onStart = res => {
      console.log("成功开始录音识别", res)
    }
    manager.onError = res => {
      console.error("识别错误", res)
    }
  }
})