
const App = getApp()
/** 全局唯一录音管理器 */
const Recorder = App.Recorder
/** 全局唯一的文件管理器 */
const FileSystem = App.FileSystem
/** 创建内部 audio 上下文 InnerAudioContext 对象 */
const InnerAudioContext = wx.createInnerAudioContext()
import {baseURL} from '../../network/config.js'

Page({

  /**
   * 页面的初始数据jpg
   */
  data: {
    poster: baseURL+ '/public/audio/Fa La La (a cappella).jpg',
    name: 'Fa La La (a cappella)',
    author: 'Justin Bieber',
    src: baseURL+ '/public/audio/Fa La La (a cappella).mp3',
    text: [
      {
        zh:'这是一年中你可以大胆',
        en:'Is it time, I hear you can give it,'
      },
      {
        zh:'献出一切的时刻',
        en:'Give it, give it, give it all,'
      },
      {
        zh:'也是你可以在列表上从一到十列出',
        en:'One through the note your list you can get it,'
      },
      {
        zh:'你想得到什么的时刻',
        en:'Get it, get it, get it now,'
      }
    ],
    lPlayType: 'wait',
    rPlayType: 'wait',
    recording: '',
    hiddenRecord: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    })

    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  tap() { //短击 录音时间过短
    this.audioCtx.pause()
    this.audioCtx.seek(0)
    wx.showToast({
      title: "录音时间过短",
      icon: "none",
      duration: 500
    })
  },
  longstart() { //长按开始录音
    this.audioCtx.pause()
    this.audioCtx.seek(0)
    App.getRecordingAuthorize()
    wx.vibrateShort()
    this.setData({
      hiddenRecord: false
    })
    Recorder.start({
      format: "wav",
      sampleRate: 16000,
      numberOfChannels: 1
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
    this.audioCtx.play()
  },
  playRecording() {  //播放录音 
    this.audioCtx.pause()
    this.audioCtx.seek(0)
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


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.audioCtx.pause()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.audioCtx.pause()
    wx.hideToast()
  }
})