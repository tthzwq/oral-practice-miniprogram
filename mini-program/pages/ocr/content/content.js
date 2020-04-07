const plugin = requirePlugin("WechatSI")
import { getOCR } from '../../../network/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disable: true,
    arr: ['camera', 'album'],
    btnArr: [
      {
        url: '/assets/image/copy.svg',
        text: '复制',
        type: 'copy'
      },
      {
        url: '/assets/image/wrap.svg',
        text: '换行',
        type: 'wrap'
      },
      {
        url: '/assets/image/translation.svg',
        text: '翻译',
        type: 'translation'
      },
      {
        url: '/assets/image/toRecord.svg',
        text: '评测',
        type: 'toRecord'
      }
    ],
    resArr: '',
    showStr: '',
    tranStr: '',
    resBreakStr: '',
    resStr: '',
  },

  /**
   * 监听页面初次渲染完成
   */
  onLoad: function (options) {
    wx.chooseImage({
      count: 1,
      sourceType: [this.data.arr[options.index]],
      success: res => {
        let imagePath = res.tempFilePaths[0]
        console.log(imagePath)
        getOCR(imagePath ,options.url).then(resovle => {
          if (resovle.code != 0) {
            wx.showToast({
              title: "数据请求失败，请稍后重试",
              image: '/assets/luoxiaohei/fail.gif'
            })
            wx.navigateBack()
            return
          }
          console.log(resovle)
          let resArr = []
          resovle.data.block[0].line.forEach( item=> {
            resArr.push(item.word[0].content)
          })
          let resBreakStr = resArr.join(" \n ")
          let resStr = resArr.join("。")
          this.setData({
            resArr: resArr,
            resBreakStr: resBreakStr,
            resStr: resStr,
            showStr: resBreakStr
          })
         
        })
      },
      fail: err => {
        wx.navigateBack()
      }
    })

    // const eventChannel = this.getOpenerEventChannel()
    // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
    // eventChannel.emit('someEvent', { data: 'test' });
    // // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('acceptDataFromOpenerPage', function (data) {
    //   console.log(data)
    // })
  },
  copy: function () {
    wx.setClipboardData({
      data: this.data.showStr,
    })
  },
  wrap: function () {
    if(this.data.showStr == this.data.resBreakStr) {
      this.setData({
        showStr: this.data.resStr
      })
    }else {
      this.setData({
        showStr: this.data.resBreakStr
      })
    }
  },
  translation: function () {
    if(this.data.tranStr) {
      this.setData({
        showStr: this.data.tranStr
      })
      return
    }
    wx.showActionSheet({
      itemList: ['中 → 英', '英 → 中'],
      success: res => {
        let language = "zh_CN"
        let toLanguage = "en_US"
        let text = this.data.resArr.join(" /****/ ")
        if(res.tapIndex == 1) {
          language = "en_US",
          toLanguage = "zh_CN"
        }
        plugin.translate({
          lfrom: language,
          lto: toLanguage,
          content: this.data.showStr,
          success: resove => {
            console.log(resove)
            if(resove.retcode == 0) {
                this.setData({
                  tranStr: resove.result,
                  showStr: resove.result
                })
            } else {
              wx.showToast({
                title: "数据请求失败，请稍后重试",
                image: '/assets/luoxiaohei/fail.gif'
              })
            }
          },
          fail: function(err) {
            console.log("",err)
            wx.showToast({
              title: "网络出错，稍后再试",
              image: '/assets/luoxiaohei/fail.gif'
            })
          }
        })
      }
    })
  },
  toRecord: function () {
    wx.showModal({
      content: '请修改文本框内容，内容不能含有中文，需要测评的句子尽量为一整句话',
      showCancel: false,
      confirmText: '我知道了',
      success: res => {
        if (res.confirm) {
          this.setData({
            disable: false
          })
        }
      }
    })

    // (escape( xxx ).indexOf("%u")<0) 没有中文

  },
  down: function(event) {
    console.log(event.detail.value)
    if(event.detail.value) {
      wx.redirectTo({
        url: '/pages/ise/ise?text='+ event.detail.value,
        complete: res => console.log(res)
      })
    }
  }
})