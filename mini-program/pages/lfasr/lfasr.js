const plugin = requirePlugin("WechatSI")
/** 获取全局唯一的语音识别管理器 */
const manager = plugin.getRecordRecognitionManager()
Page({
  data: {
    btnArr: [
      {
        url: '/assets/image/translation.svg',
        text: '翻译',
        type: 'translation'
      },
      {
        url: '/assets/image/copy.svg',
        text: '复制',
        type: 'copy'
      },
      {
        url: '/assets/image/toRecord.svg',
        text: '评测',
        type: 'toRecord'
      }
    ],
    disable: true,
    hiddenRecord: true,
    showStr: '',
    tranStr: '',
    resStr: '',
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
    this.setData({
      hiddenRecord: false
    })
    manager.start()
  },
  touchend() { //结束录音
    manager.stop()
    this.setData({
      hiddenRecord: true
    })
  },
  touchbreak() { //录音被打断
    wx.showToast({
      title: "录音被打断",
      image: '/assets/luoxiaohei/lei.gif'
    })
    this.setData({
      hiddenRecord: true
    })
  },
  translation: function() {  /** 翻译 */
    if(this.data.showStr == '') {
      wx.showToast({
        title: "请输入内容",
        icon: "none",
        duration: 500
      })
      return
    }
    if(this.data.tranStr) {
      if(this.data.showStr == this.data.tranStr) {
        this.setData({
          showStr: this.data.resStr
        })
      }else {
        this.setData({
          showStr: this.data.tranStr
        })
      }
      return
    }
    wx.showActionSheet({
      itemList: ['中 → 英', '英 → 中'],
      success: res => {
        let language = "zh_CN"
        let toLanguage = "en_US"
        if(res.tapIndex == 1) {
          language = "en_US",
          toLanguage = "zh_CN"
        }
        plugin.translate({
          lfrom: language,
          lto: toLanguage,
          content: this.data.showStr,
          success: resove => {
            console.log(resove)
            if(resove.retcode == 0) {
                this.setData({
                  tranStr: resove.result,
                  showStr: resove.result
                })
            } else {
              wx.showToast({
                title: "数据请求失败，请稍后重试",
                image: '/assets/luoxiaohei/fail.gif'
              })
            }
          },
          fail: function(err) {
            console.log("",err)
            wx.showToast({
              title: "网络出错，稍后再试",
              image: '/assets/luoxiaohei/fail.gif'
            })
          }
        })
      }
    })
  },
  copy: function() {  /** 复制到剪切板 */
    if (this.data.showStr == '') {
      wx.showToast({
        title: "请输长按录音",
        icon: "none",
        duration: 500
      })
      return
    }
    wx.setClipboardData({
      data: this.data.showStr,
    })
  },
  toRecord: function() {  /** ise语音评测 */
    if(this.data.showStr == '') {
      wx.showToast({
        title: "请输入内容",
        icon: "none",
        duration: 500
      })
      return
    }
    wx.showModal({
      content: '请修改文本框内容，内容不能含有中文，需要测评的句子尽量为一整句话',
      showCancel: false,
      confirmText: '我知道了',
      success: res => {
        if (res.confirm) {
          this.setData({
            disable: false
          })
        }
      }
    })
  },
  down: function(event) {
    if(event.detail.value) {
      wx.setStorageSync('ise', event.detail.value)
      wx.navigateTo({
        url: '/pages/ise/ise?type='+ "ocr"
      })
    }else {
      wx.showToast({
        title: "请输入内容",
        icon: "none",
        duration: 500
      })
    }
  },


  
  onReady: function () {
    manager.onRecognize = res => { //有新的识别内容返回，则会调用此事件
      this.setData({
        resStr: res.result,
        showStr: res.result
      })
    }
    manager.onStop = res => {
      this.setData({
        resStr: res.result,
        showStr: res.result
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