import {getTts} from '../../network/api.js'
const plugin = requirePlugin("WechatSI")
/** 创建内部 audio 上下文 InnerAudioContext 对象 */
const InnerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    speaker: [
      {
        value: 0,
        name: '云小宁，亲和女声',
        image: '/assets/head/Schoolgirl.svg'
      },
      {
        value: 1,
        name: '云小奇，亲和男声',
        image: '/assets/head/Schoolboy.svg'
      },
      {
        value: 2,
        name: '云小晚，成熟男声',
        image: '/assets/head/man.svg'
      },
      {
        value: 4,
        name: '云小叶，温暖女声',
        image: '/assets/head/Schoolgirl.svg'
      },
      {
        value: 5,
        name: '云小欣，情感女声',
        image: '/assets/head/Schoolgirl.svg'
      },
      {
        value: 6,
        name: '云小龙，情感男声',
        image: '/assets/head/Schoolboy.svg'
      },
      {
        value: 1000,
        name: '智侠、情感男声',
        image: '/assets/head/Schoolboy.svg'
      },
      {
        value: 1001,
        name: '智瑜，情感女声',
        image: '/assets/head/Schoolgirl.svg'
      },
      {
        value: 1002,
        name: '智聆，通用女声',
        image: '/assets/head/woman.svg'
      },
      {
        value: 1003,
        name: '智美，客服女声',
        image: '/assets/head/woman.svg'
      },
      {
        value: 1050,
        name: 'WeJack，英文男声',
        image: '/assets/head/man.svg',
        checked: true
      },
      {
        value: 1051,
        name: 'WeRose，英文女声',
        image: '/assets/head/woman.svg'
      }
    ],
    btnArr: [
      {
        text: '合成',
        type: 'tts'
      },
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
    /** 语速 */
    speed: 0,
    /** 音量 */
    volume: 5,
    /** 发音人 */
    checkSpeaker: 1050,
    lPlayType: 'wait',
    tts: '',
    resStr: '',
    showStr: '',
    tranStr: '',
  },
  speakerChange: function(even) {  /** 选择发音人 */
    this.setData({
      checkSpeaker: even.value,
      tts: ''
    })
  },
  volumeChange: function(even) {  /** 调节音量 */
    this.setData({
      volume: even.detail.value,
      tts: ''
    })
  },
  speedChange: function(even) {  /** 调节语速 */
    this.setData({
      speed: even.detail.value,
      tts: ''
    })
  },
  setStr: function(even) {  /** 文本框失去焦点时触发 */
    console.log("文本框失去焦点时触发", even)
    let str = even.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    // .replace(/\s+/g, " ") //去除连续空格 回车
    this.setData({
      tts: '',
      resStr: str,
      showStr: str,
      tranStr: ''
    })
  },
  tts: function() {  /** tts语音合成 */
    if(this.data.showStr == '') {
      wx.showToast({
        title: "请输入内容",
        icon: "none",
        duration: 500
      })
      return
    }
    wx.showToast({
      title: "语音合成中...",
      image: '/assets/luoxiaohei/loading.gif',
      duration: 999999
    })
    this.setData({
      lPlayType: 'loading'
    })
    let option = {
      text: this.data.showStr,
      sessionId: '5e79e21c3e2c73437cb5b4f9',
      speed: this.data.speed,
      voiceType: this.data.checkSpeaker,
      volume: this.data.volume
    }
    console.log(option)
    getTts(option).then(res => {
      wx.hideToast()
      this.setData({
        lPlayType: 'playing',
        tts: res
      })
      InnerAudioContext.stop()
      InnerAudioContext.src = res
      InnerAudioContext.play()
    }).catch(err => {
      wx.hideToast()
      wx.showToast({
        title: "语音合成失败",
        image: '/assets/luoxiaohei/fail.gif'
      })
      this.setData({
        lPlayType: 'wait'
      })
    })
  },
  translation: function () {  /** 翻译 */
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
  copy: function() { /** 复制到剪切板 */
    if(this.data.showStr == '') {
      wx.showToast({
        title: "请输入内容",
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
      cancelText: '修改文本',
      confirmText: '我知道了',
      success: res => {
        if (res.confirm) {
          wx.setStorageSync('ise', this.data.showStr)
          wx.navigateTo({
            url: '/pages/ise/ise?type='+ "tts"
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    InnerAudioContext.onEnded(() => { //监听音频自然播放至结束
      this.setData({
        lPlayType: 'wait'
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})