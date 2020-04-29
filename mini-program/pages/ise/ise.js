import { getIse, getItemBank, getTts} from '../../network/api.js'
const App = getApp()
/** 全局唯一录音管理器 */
const Recorder = App.Recorder
/** 全局唯一的文件管理器 */
const FileSystem = App.FileSystem
/** 创建内部 audio 上下文 InnerAudioContext 对象 */
const InnerAudioContext = wx.createInnerAudioContext()

// pages/ise/ise.js
Page({
  data: {
    itemBank: [],
    current: 0,
    lPlayType: 'wait',
    rPlayType: 'wait',
    tts: '',
    recording: '',
    hiddenRecord: true,
    /** 总分 */
    total_score: 0,
    /** 音节得分 */
    syll_score: [],
    /** 完整度分 */
    integrity_score: 0,
    /** 流畅度分 */
    fluency_score: 0,
    /** 准确度分 */
    accuracy_score: 0,
    
  },
  swiperChange(event) { //切换题目时触发
    if (this.data.tts) { //删除tts语音文件缓存
      FileSystem.unlink({filePath:this.data.tts})
    }
    this.setData({ 
      current: event.detail.current,
      tts: '',
      recording: '',
      total_score: 0,
      syll_score: [],
      integrity_score: 0,
      fluency_score: 0,
      accuracy_score: 0,
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
    Recorder.start({
      format: "wav", // 音频格式
      sampleRate: 16000, // 采样率
      numberOfChannels: 1 // 录音通道数
    })
  },
  touchend() { //结束录音
    Recorder.stop()
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
  playTts() {  //播放TTS语音
    if(this.data.tts) {
      this.setData({
        lPlayType: 'playing'
      })
      InnerAudioContext.stop()
      InnerAudioContext.src = this.data.tts
      InnerAudioContext.play()
      return
    }
    wx.showToast({
      title: "语音合成中...",
      image: '/assets/luoxiaohei/money.gif',
      duration: 999999
    })
    this.setData({
      lPlayType: 'loading'
    })
    let option = {
      text: this.data.itemBank[this.data.current].message,
      sessionId: this.data.itemBank[this.data.current]._id
    }
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
        title: "语音合成失败，请稍后重试",
        image: '/assets/luoxiaohei/fail.gif'
      })
      this.setData({
        lPlayType: 'wait'
      })
    })
  },
  playRecording() {  //播放录音 
    if(this.data.recording) {
      InnerAudioContext.stop()
      InnerAudioContext.src = this.data.recording
      InnerAudioContext.play()
      this.setData({
        rPlayType: 'playing'
      })
    } else {
      wx.showToast({
        title: "请先录音",
        icon: "none",
        duration: 500
      })
    }
  },

  onLoad: function (option) {
    if(option.type) {
      wx.getStorage({
        key: 'ise',
        success: res => {
          let arr = []
          res.data.split("\n").forEach((item, index) => {
            arr.push({
              message: item,
              _id: '5e79e356842d12348b006c8' + index
            })
          })
          this.setData({
            itemBank: arr
          })
        }
      })
      return
    }
    if(option.name) {
      getItemBank(option.name).then(res =>{
        console.log(res)
        if (res.err_code == 0) {
          this.setData({
            itemBank: res.data
          })
        }
      }
      )
    }
  },
  onReady: function () {
    InnerAudioContext.onError((res) => { //监听音频播放错误
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    InnerAudioContext.onEnded(() => { //监听音频自然播放至结束
      this.setData({
        lPlayType: 'wait',
        rPlayType: 'wait'
      })
    })
    Recorder.onStop(res => { //监听结束录音
      this.setData({
        recording: res.tempFilePath
      })
      getIse(this.data.itemBank[this.data.current].message, res.tempFilePath).then(res => {
        console.log(res)
        let syll_score = []
        if(res.code != 0) {
          wx.showToast({
            title: "数据请求失败，请稍后重试",
            image: '/assets/luoxiaohei/fail.gif'
          })
          return
        }
        res.data.read_sentence.rec_paper.read_chapter.sentence.word.forEach(item =>{
          syll_score.push({
            content: item.content,
            score: Math.round(item.total_score * 100) / 100
          })
        })
        this.setData({
          syll_score: syll_score,
          total_score: Math.round(res.data.read_sentence.rec_paper.read_chapter.total_score * 100) / 100,
          fluency_score: Math.round(res.data.read_sentence.rec_paper.read_chapter.fluency_score * 100) / 100,
          accuracy_score: Math.round(res.data.read_sentence.rec_paper.read_chapter.accuracy_score * 100) / 100,
          integrity_score: Math.round(res.data.read_sentence.rec_paper.read_chapter.integrity_score * 100) / 100,
        })
      })
    })
  },
  onUnload: function () {
    wx.hideToast()
    if (this.data.tts) { //删除tts语音文件缓存
      FileSystem.unlink({ filePath: this.data.tts })
    }
  }
})