// pages/ocr/ocr.js
import { getOCR } from '../../network/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onLoad() {
    this.Camera = wx.createCameraContext()
  },
  takePhoto(event) {

    
    let url = event.currentTarget.dataset.url
    wx.chooseImage({
      count: 1,
      success: res => {
        getOCR(res.tempImagePath, url).then(data => {
          console.log(data)
        })
      }
    })
  }
})