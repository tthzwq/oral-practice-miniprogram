// pages/course/course.js
import {getSubjectList} from '../../network/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    list: [
      {
        img: "https://www.tthzwq.com/public/img/subject/default2.png",
        title: "初级口语交际",
        level: "初级",
        name: "0001"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default1.png",
        title: "初级口语交际",
        level: "初级",
        name: "0001",
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default3.png",
        title: "初级口语交际",
        level: "初级",
        name: "0001"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default4.png",
        title: "初级口语交际",
        level: "初级",
        name: "0001"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default3.png",
        title: "初级口语交际",
        level: "初级",
        name: "0001"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default3.png",
        title: "初级口语交际",
        level: "初级",
        name: "0001"
      }
    ],
    classList: [
      {
        img: "https://www.tthzwq.com/public/img/subject/default2.png",
        title: "初级口语交际",
        level: "初级",
        name: "c0001"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default1.png",
        title: "初级口语交际",
        level: "初级",
        name: "c0002"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default3.png",
        title: "初级口语交际",
        level: "初级",
        name: "c0003"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default4.png",
        title: "初级口语交际",
        level: "初级",
        name: "c0004"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default3.png",
        title: "初级口语交际",
        level: "初级",
        name: "c0005"
      },
      {
        img: "https://www.tthzwq.com/public/img/subject/default3.png",
        title: "初级口语交际",
        level: "初级",
        name: "c0006"
      }
    ]
  },
  swiperChange:function(even) {
    this.setData({
      current: even.current
    })
  },
  navigateTo: function(e) {
    wx.navigateTo({
      url: "/pages/ise/ise?name="+ e.currentTarget.dataset.name
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getSubjectList().then(res => {
      this.setData({
        list: res.data[0],
        classList: res.data[1]
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHnamee: function () {

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