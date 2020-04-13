import {getTts, AIUI} from '../../network/api.js'
const App = getApp()
const FileSystem = App.FileSystem
const plugin = requirePlugin("WechatSI")
/** 获取全局唯一的语音识别管理器 */
const manager = plugin.getRecordRecognitionManager()
/** 创建内部 audio 上下文 InnerAudioContext 对象 */
const InnerAudioContext = wx.createInnerAudioContext()
Page({
  data: {
    id: "tthzoroza5m2s7amlx5pcce7jwngy3og",
    hiddenRecord: true,
    question: '',
    answer: '',
    tts: '',
    sid: ''
  },
  onLoad: function() {
    wx.getStorage({
      key: 'openid',
      success: res => {
        this.setData({
          id: res.data
        })
      }
    })
  },
  tap() { //短击 录音时间过短
    wx.showToast({
      title: "录音时间过短",
      icon: "none",
      duration: 500
    })
  },
  longstart() { //长按开始录音
    App.getRecordingAuthorize()
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
    wx.hideToast()
    wx.showToast({
      title: "录音被打断",
      image: '/assets/luoxiaohei/lei.gif'
    })
    this.setData({
      hiddenRecord: true
    })
  },
  onReady: function () {
    manager.onRecognize = res => { //有新的识别内容返回，则会调用此事件
      this.setData({
        question: res.result
      })
    }
    manager.onStop = res => { 
      this.setData({
        question: res.result
      })
      AIUI(res.result).then(resove => {
        if(resove.code != 0) {
          wx.showToast({
            title: "数据请求失败，请稍后重试",
            image: '/assets/luoxiaohei/fail.gif'
          })
          return
        }
        this.setData({
          answer: resove.data[0].intent.answer.text,
          sid: resove.sid
        })
        let option = {
          text: resove.data[0].intent.answer.text,
          // sessionId: resove.sid.substr(0, 11),
          sessionId: this.data.id,
          voiceType: 5
        }
        getTts(option).then(tts => {
          this.setData({
            tts: tts
          })
          InnerAudioContext.stop()
          InnerAudioContext.src = tts
          InnerAudioContext.play()
        })
        
      })

    }
    manager.onStart = res => {
      console.log("成功开始录音识别", res)
    }
    manager.onError = res => {
      console.error("识别错误", res)
    }

    // InnerAudioContext.onError((res) => { //监听音频播放错误
    //   console.log(res.errMsg)
    //   console.log(res.errCode)
    // })
    InnerAudioContext.onEnded(() => { //监听音频自然播放至结束
    })
  },
  onUnload: function () {
    if (this.data.tts) { //删除tts语音文件缓存
      FileSystem.unlink({ filePath: this.data.tts })
    }
  }
})