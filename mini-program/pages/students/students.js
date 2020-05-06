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
      // {
      //   title: "班级任务",
      //   type: "study"
      // },
      {
        title: "认证状态",
        type: "status"
      },
    ],
    students:[],
    resStudents: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      classId : options.classId
    })
    findStudent(this.data.classId).then(res => {
      if (res.code != 0) {
        return
      }
      res.data[0].forEach(item => {
        item.status = 0
        item.log = 0
        for (let i = 0; i < res.data[1].length; i++) {
          const element = res.data[1][i];
          if(item.studentId == element.studentId) {
            item.log = element.clock.length
            item.status = 1
          }
        }
      })
      this.setData({
        students: res.data[0],
        resStudents: res.data[0]
      })
    })
  },

  /**
   * 排序数组
   */
  itemChange: function(e) {
    const arr = this.data.resStudents
    this.setData({
      num: e.num,
      nowtype: e.type,
      students: arr.sort(this.compare(e.type, e.num))
    })
  },

  /**
   * @param {String} type 根据type排序 必填
   * @param {String} rule 正序倒序 必填
   * @returns {Promise} 返回Promise实例
  */
  compare: function (type, rule) {
    if(type == 'name') { // 中文排序
      return function (a, b) {
        const value1 = a[type];
        const value2 = b[type];
        if(rule == 0){
          return value1.localeCompare(value2,"zh");
        }else if(rule == 1) {
          return value2.localeCompare(value1,"zh");
          // return value2 - value1;
        }
      }
    }else {
      return function (a, b) {
        const value1 = a[type];
        const value2 = b[type];
        if(rule == 0){
          return value1 - value2;
        }else if(rule == 1) {
          return value2 - value1;
        }
      }
    }
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