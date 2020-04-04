// pages/ocr/ocr.js
import { getOCR } from '../../network/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [
      {
        image: '/assets/image/OCR_general.svg',
        content: '印刷体识别',
        url: 'general',
        type: ''
      },
      {
        image: '/assets/image/OCR_handwriting.svg',
        content: '手写体识别',
        url: 'handwriting',
        type: ''
      },
      {
        image: '/assets/image/OCR_idCard.svg',
        content: '身份证识别',
        url: '',
        type: 'idCard'
      },
      {
        image: '/assets/image/OCR_drivingLicense.svg',
        content: '驾驶证识别',
        url: '',
        type: 'drivingLicense'
      },
      {
        image: '/assets/image/OCR_bankCard.svg',
        content: '银行卡识别',
        url: '',
        type: 'bankCard'
      },
      {
        image: '/assets/image/OCR_businessLicense.svg',
        content: '营业执照识别',
        url: '',
        type: 'businessLicense'
      }
    ]
  },
  takeOCR(event) {
    let dataset = event.currentTarget.dataset
    wx.navigateTo({
      url: './content/content?url=' + dataset.url + '&type=' + dataset.type


      // url: './content/content?id=1',
      // events: {
      //   // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      //   acceptDataFromOpenedPage: function (data) {
      //     console.log(data)
      //   },
      //   someEvent: function (data) {
      //     console.log(data)
      //   }
      // },
      // success: function (res) {
      //   // 通过eventChannel向被打开页面传送数据
      //   res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      // }



    })
  }
})