// pages/ocr/ocr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [
      {
        image: '/assets/image/OCR_general.svg',
        content: '印刷体识别',
        url: 'general'
        // url: 'recognize_document'
      },
      {
        image: '/assets/image/OCR_handwriting.svg',
        content: '手写体识别',
        url: 'handwriting',
      },
      {
        image: '/assets/image/OCR_idCard.svg',
        content: '身份证识别',
        url: 'idcard',
      },
      {
        image: '/assets/image/OCR_drivingLicense.svg',
        content: '名片识别',
        url: 'business_card',
      },
      {
        image: '/assets/image/OCR_bankCard.svg',
        content: '银行卡识别',
        url: 'bankcard',
      },
      {
        image: '/assets/image/OCR_businessLicense.svg',
        content: '营业执照识别',
        url: 'business_license',
      }
    ]
  },
  takeOCR(event) {
    let url = event.currentTarget.dataset.url
    wx.showActionSheet({
      itemList: ['使用相机拍照','选择本地图片'],
      success: res => {
        let index = res.tapIndex
        wx.navigateTo({
          url: './content/content?url=' + url + '&index=' + index
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
  }
})