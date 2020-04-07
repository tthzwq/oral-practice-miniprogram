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
    question: '',
    answer: '',
    tts: '',
    sid: ''
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
    wx.showToast({
      title: '录音中...',
      image: '/assets/luoxiaohei/drink.gif',
      duration: 999999
    })
    manager.start()
  },
  touchend() { //结束录音
    manager.stop()
    wx.hideToast()
  },
  touchbreak() { //录音被打断
    wx.hideToast()
    wx.showToast({
      title: "录音被打断",
      image: '/assets/luoxiaohei/lei.gif'
    })
  },
  onReady: function () {
    manager.onRecognize = res => { //有新的识别内容返回，则会调用此事件
      console.log("current result", res.result)
      this.setData({
        question: res.result
      })
    }
    manager.onStop = res => { 
      console.log("识别结束", res)
      console.log("record file path", res.tempFilePath)
      console.log("result", res.result)
      this.setData({
        question: res.result
      })
      AIUI(res.result).then(resove => {
        console.log(resove)
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
          sessionId: resove.sid.substr(0, 11),
          voiceType: 5,
          speed: 2
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

    InnerAudioContext.onError((res) => { //监听音频播放错误
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    InnerAudioContext.onEnded(() => { //监听音频自然播放至结束
    })
  },
  onUnload: function () {
    if (this.data.tts) { //删除tts语音文件缓存
      FileSystem.unlink({ filePath: this.data.tts })
    }
  }
})