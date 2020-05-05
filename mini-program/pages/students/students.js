import {findStudent} from '../../network/login.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classId: '',
    nowtype: "studentId",
    num: 0,
    option: [
      {
        title: "学号",
        type: "studentId"
      },
      {
        title: "姓名",
        type: "name"
      },
      {
        title: "累计打卡",
        type: "log"
      },
      {
        title: "班级任务",
        type: "study"
      },
    ],
    students:[
      {
        studentId: 1601103088,
        name: "郑文强",
        log: 15,
        study: 60
      }
    ]
  },

  itemChange: function(e) {
    this.setData({
      num: e.num,
      nowtype: e.type
    })
    console.log(e.num)
    console.log(e.type)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classId : options.classId
    })
    findStudent(this.data.classId).then(res => {
      this.setData({
        students: res.data[0]
      })
      console.log(res)
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