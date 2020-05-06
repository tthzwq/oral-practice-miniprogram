// pages/task/task.js
const App =getApp()
import {getSubjectList} from '../../network/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getSubjectList(App.globalData.bindInfo.data.classId).then(res => {
      this.setData({
        classList: res.data[1]
      })
    })
  },

  navigateTo: function(e) {
    wx.navigateTo({
      url: "/pages/ise/ise?name="+ e.currentTarget.dataset.name
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