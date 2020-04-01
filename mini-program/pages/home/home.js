// pages/home/home.js
import { getIse, getItemBank } from '../../network/api.js'

const Recorder = wx.getRecorderManager()
const InnerAudioContext  = wx.createInnerAudioContext()




let plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()


manager.onStart = function (res) {
  console.log("成功开始录音识别", res)
}
manager.onError = function (res) {
  console.error("error msg", res.msg)
}


InnerAudioContext.onPlay(() => {
  console.log('开始播放')
})
InnerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})

Recorder.onStop(res => { //监听结束录音
  console.log('监听结束录音')
  InnerAudioContext.src = res.tempFilePath

  getIse('I am the king of the world', res.tempFilePath)
  .then(res => console.log(res))

  // wx.uploadFile({  //上传录音文件
  //   url: "http://192.168.0.100:3000/upload",
  //   method: "post",
  //   filePath: res.tempFilePath,
  //   name: "wx",
  //   formData: {
  //     text: 'I am the king of the world'
  //   },
  //   success(ret) {
  //     const options = JSON.parse(ret.data)
  //     console.log(options)
  //     post({
  //       url: options.url,
  //       data: options.data,
  //       header: options.headers
  //     }).then(res => {
  //       console.log(res)
  //     })

  //     // wx.request({
  //     //   url: options.url,
  //     //   method: 'POST',
  //     //   data: options.data,
  //     //   header: options.headers,
  //     //   success: (res) => {
  //     //     console.log(res)
  //     //   },
  //     //   fail: (error) => {
  //     //     console.log(error)
  //     //   },
  //     // })

  //   },
  //   fail(err) {
  //     console.log("录音发送到后台失败");
  //     console.log(err);
  //   }
  // })
})

Page({
  data: {
    txt: ''
  },
  onReady() {
  },
  onShow() {
    manager.onRecognize = res => {
      console.log("current result", res.result)
      this.setData({ txt: res.result })
    }
    manager.onStop = res => {
      console.log("record file path", res.tempFilePath)
      console.log("result", res.result)
      this.setData({ txt: res.result })
    }
  },
  start() {
    console.log('开始录音')
    Recorder.start({
      format: "wav",
      sampleRate: 16000,
      numberOfChannels: 1
    })
  },
  end() {
    Recorder.stop()
    console.log('结束录音')
  },
  play() {
    InnerAudioContext.play()
  },
  sss() {
    manager.start({ duration: 30000, lang: "zh_CN" })
  },
  stt() {
    manager.stop()
  }
})
