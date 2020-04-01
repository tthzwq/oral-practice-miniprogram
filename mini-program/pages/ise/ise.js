import { getIse, getItemBank, getTts} from '../../network/api.js'
const App = getApp()
/** 全局唯一录音管理器 */
const Recorder = App.Recorder
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
  /** 切换题目时触发*/
  swiperChange(event) {
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
  /** 录音时间过短*/
  tap() {
    wx.showToast({
      title: "录音时间过短",
      icon: "none",
      duration: 500
    })
  },
  /** 长按开始录音*/
  longstart() {
    // console.log("长击longtap")
    wx.vibrateShort()
    // console.log('开始录音')
    Recorder.start({
      format: "wav",
      sampleRate: 16000,
      numberOfChannels: 1
    })
  },
  /** 录音结束*/
  touchend() {
    Recorder.stop()
    // console.log('结束录音')
  },
  /** 录音被打断*/
  touchbreak() {
    // console.log("录音被打断")
    wx.showToast({
      title: "录音被打断",
      icon: "none",
      duration: 500
    })
  },
  /** 播放TTS语音*/
  playTts() {
    if(this.data.tts) {
      this.setData({
        lPlayType: 'playing'
      })
      InnerAudioContext.stop()
      InnerAudioContext.src = this.data.tts
      InnerAudioContext.play()
      return
    }
    this.setData({
      lPlayType: 'loading'
    })
    let option = {
      text: this.data.itemBank[this.data.current].message,
      sessionId: this.data.itemBank[this.data.current]._id
    }
    getTts(option).then(res => {
      this.setData({
        lPlayType: 'playing',
        tts: res
      })
      InnerAudioContext.stop()
      InnerAudioContext.src = res
      InnerAudioContext.play()
    }).catch(err => {
      this.setData({
        lPlayType: 'wait'
      })
    })
  },
  /** 播放录音 */
  playRecording() {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    getItemBank().then(res => {
      this.setData({
        itemBank: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // InnerAudioContext.onPlay(() => {
    //   console.log('开始播放')
    // })
    InnerAudioContext.onError((res) => {
      // console.log('监听音频播放错误')
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    InnerAudioContext.onEnded(() => {
      // console.log('监听音频自然播放至结束')
      this.setData({
        lPlayType: 'wait',
        rPlayType: 'wait'
      })
    })

    Recorder.onStop(res => { //监听结束录音
      // console.log('监听结束录音')
      this.setData({
        recording: res.tempFilePath
      })
      getIse(this.data.itemBank[this.data.current].message, res.tempFilePath).then(res => {
        // console.log(res)
        let syll_score = []
        res.data.read_sentence.rec_paper.read_chapter.sentence.word.forEach(item =>{
          syll_score.push({
            content: item.content,
            score: Math.round(item.total_score * 100) / 100
          })
        })
        this.setData({
          /** 总分 */
          total_score: Math.round(res.data.read_sentence.rec_paper.read_chapter.total_score * 100) / 100,
          /** 音节得分 */
          syll_score: syll_score,
          /** 完整度分 */
          integrity_score: Math.round(res.data.read_sentence.rec_paper.read_chapter.integrity_score * 100) / 100,
          /** 流畅度分 */
          fluency_score: Math.round(res.data.read_sentence.rec_paper.read_chapter.fluency_score * 100) / 100,
          /** 准确度分 */
          accuracy_score: Math.round(res.data.read_sentence.rec_paper.read_chapter.accuracy_score * 100) / 100
        })
      })
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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