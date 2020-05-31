
const App = getApp()
/** 全局唯一录音管理器 */
const Recorder = App.Recorder
/** 全局唯一的文件管理器 */
// const FileSystem = App.FileSystem
/** 创建内部 audio 上下文 InnerAudioContext 对象 */
const InnerAudioContext = wx.createInnerAudioContext()
import {baseURL} from '../../network/config.js'
// pages/dubbing/dubbing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exportPath: '',
    videoPath: '',
    progress: 0,
    rPlayType: 'wait',
    recording: '',
    hiddenRecord: true,
    text: [
      {
        en: 'Hello,Jack.',
        zh: '你好，杰克。'
      },
      {
        en: 'I changed my mind.',
        zh: '我改变生意了'
      },
      {
        en: 'They said you might be up here...',
        zh: '他们说你可能在这里'
      },
      {
        en: 'Give me your hand.',
        zh: '把手给我'
      },
      {
        en: 'Now close your eyes.',
        zh: '现在闭上眼睛。'
      },
      {
        en: 'Go on',
        zh: '闭上眼睛'
      },
      {
        en: 'Now step up.',
        zh: '上来'
      },
      {
        en: 'Now hold on to the railing.Keep your eyes closed.',
        zh: '抓紧栏杆 眼睛闭好'
      },
      {
        en: "Don't peek. - I'm not",
        zh: '别偷看 - 我没偷看'
      },
      {
        en: 'Step up onto the rail.',
        zh: '踩到栏杆上'
      },
      {
        en: 'Hold on.Hold on.',
        zh: '抓紧 抓紧'
      },
      {
        en: 'Keep your eyes closed.',
        zh: '眼睛闭好'
      },
      {
        en: 'Do you trust me? - I trust you',
        zh: '你相信我吗 - 我相信你'
      },
      {
        en: 'All right，open your eyes.',
        zh: '好了 睁开眼睛吧'
      },
      {
        en: "I'm flying.Jack.",
        zh: '我飞起来了 杰克'
      }
    ],
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(new Date().getTime() > 1589472000000) {
      this.setData({
        show: true
      })
      this.DownloadTask = wx.downloadFile({ // 下载视频文件
        url: baseURL+'/public/mp4/Titanic_01.mp4',
        success: res => {
          this.setData({
            videoPath: res.tempFilePath
          })
        },
        fail: err => {
          wx.showToast({
            title: '视频下载失败，请稍后重试',
            icon: 'none'
          })
        }
      })
      this.DownloadTask.onProgressUpdate(resove => { // 监听下载进度变化
        this.setData({
          progress: resove.progress
        })
        if(resove.progress == 100) {
          this.DownloadTask.offProgressUpdate()
        }
      })
    }

    // this.videoCtx.pause() // 暂停
    // this.videoCtx.paly() // 播放
    // this.videoCtx.stop() // 停止
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo') // 创建 video 上下文 VideoContext 对象
    InnerAudioContext.onError((res) => { //监听音频播放错误
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    InnerAudioContext.onEnded(() => { //监听音频自然播放至结束
      this.setData({
        rPlayType: 'wait'
      })
    })
    Recorder.onStop(res => { //监听结束录音
      this.setData({
        recording: res.tempFilePath
      })
    })
    
    this.MediaContainer = wx.createMediaContainer() //  音视频处理容器
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
    if(this.data.videoPath && this.data.recording) {
      wx.showToast({
        title: '正在合成',
        icon: "none"
      })
      this.MediaContainer.extractDataSource({
        source:this.data.videoPath,
        success: res => {
          console.log(res)
          this.MediaContainer.addTrack(res.tracks[1])
          this.MediaContainer.export({
            success: res => {
              this.setData({
                exportPath: res.tempFilePath
              })
              this.videoContext.play() // 播放视频
              InnerAudioContext.stop()
              InnerAudioContext.src = this.data.recording
              InnerAudioContext.play() // 播放音频
            }
          })
        }
      })
    }else {
      this.videoContext.play() // 播放视频
    }
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
  

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.hideToast()
    this.MediaContainer.destroy()
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