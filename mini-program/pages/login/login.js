import { $wuxToptips } from '../../components/wux-weapp/index.js'
import { getSmsCode, checkTel, checkIdentity, register, checkOpenid } from '../../network/login.js'
const App = getApp()
Page({
  data: {
    openid: '',
    current: 0, // 当前步骤
    class: true, // 是否有班级
    time: 60, // 验证码倒计时
    captcha: { // 后端返回的验证数据
      code:1,
      tel: 13012345678,
      smsCode: 123456
    },
    classInfo:{},
    disCaptcha: true, // 禁用验证码输入框
    disCaptchaBtn: false, // 禁用验证码按钮
    disNextBtn: true, // 禁用 ‘下一步’ 按钮
    formData: {
      identity: 0 // 0 学生 ; 1 教师
    }, // 表单数据
    errData: {}, // 表单验证结果
    rules: [{ // 表单验证规则
        name: 'name',
        rules: [{
          maxlength: 10,
          message: '请输入正确的姓名'
        }, {
          minlength: 2,
          message: '请输入正确的姓名'
        }, {
          required: true,
          message: '请输入姓名'
        }],
      },
      {
        name: 'studentId',
        rules: [{
          maxlength: 10,
          message: '请输入正确的学号'
        }, {
          minlength: 10,
          message: '请输入正确的学号'
        }, {
          required: true,
          message: '请输入学号'
        }],
      }
    ],
  },
  selectChange: function (e) { // 切换身份
    this.setData({
      disNextBtn: true
    })
    if (e.detail.key == 0) {
      this.setData({
        ["formData.identity"]: e.detail.key,
        ['formData.teacherId']: '',
        rules: [{
            name: 'name',
            rules: [{
              maxlength: 10,
              message: '请输入正确的姓名'
            }, {
              minlength: 2,
              message: '请输入正确的姓名'
            }, {
              required: true,
              message: '请输入姓名'
            }],
          },
          {
            name: 'studentId',
            rules: [{
              maxlength: 10,
              message: '请输入正确的学号'
            }, {
              minlength: 10,
              message: '请输入正确的学号'
            }],
          }
        ]
      })
    } else {
      this.setData({
        ["formData.identity"]: e.detail.key,
        ['formData.studentId']: '',
        rules: [{
            name: 'name',
            rules: [{
              maxlength: 10,
              message: '请输入正确的姓名'
            }, {
              minlength: 2,
              message: '请输入正确的姓名'
            }],
          },
          {
            name: 'teacherId',
            rules:  [{
              maxlength: 10,
              message: '请输入正确的teacherId'
            }, {
              minlength: 10,
              message: '请输入正确的teacherId'
            }],
          }
        ]
      })
    }
  },
  nextStep: function () { // 下一步
    const current = this.data.current > 1 ? 0 : this.data.current + 1
    this.setData({
      current,
      disNextBtn: true
    })
    if (current == 1) {
      this.setData({
        rules: [
          {
            name: 'tel',
            rules: [{
              required: true,
              message: '请输入手机号'
            }, {
              mobile: true,
              message: '请输入正确的手机号'
            }],
          },
          {
            name: 'captcha',
            rules: [{
              maxlength: 6,
              message: '请输入正确的验证码'
            }, {
              minlength: 6,
              message: '请输入正确的验证码'
            }, {
              required: true,
              message: '请输入验证码'
            }],
          }
        ],
      })
    }
    // if (current == 2) {
    //   this.setData({
    //     rules: [
    //       {
    //         name: 'classId',
    //         rules: [{
    //           maxlength: 5,
    //           message: '请输正确的班级代号'
    //         }, {
    //           minlength: 5,
    //           message: '请输正确的班级代号'
    //         }, {
    //           required: true,
    //           message: '请输入班级代号'
    //         }],
    //       },
    //       {
    //         name: 'classPwd',
    //         rules: [{
    //           maxlength: 4,
    //           message: '请输四位数字的班级验证码'
    //         }, {
    //           minlength: 4,
    //           message: '请输四位数字的班级验证码'
    //         }, {
    //           required: true,
    //           message: '请输入班级班级验证码'
    //         }],
    //       }
    //     ],
    //   })
    // }
  },
  formInputChange: function (e) { // 监听input输入
    this.setData({
      [`formData.${e.currentTarget.dataset.field}`]: e.detail.value,
      disNextBtn: true
    })
  },
  formInputDown: function (e) { // input失去焦点 验证当前表单
    this.checkInput(e.currentTarget.dataset.field)
    if(e.currentTarget.dataset.field == 'captcha') {
      if (this.data.formData.captcha == this.data.captcha.smsCode && this.data.formData.tel == this.data.captcha.tel) {
        $wuxToptips().success({
          text: '验证成功',
          duration: 1000
        })
        this.setData({
          disNextBtn: false
        })
      }else {
        $wuxToptips().warn({
          text: '验证码不正确',
          duration: 1000
        })
        this.setData({
          disNextBtn: true
        })
      }
    }
  },
  checkInput: function(name) { // 验证单个表单
    this.selectComponent('#form').validateField(name, (valid, errors) => {
      if (valid) {
        this.setData({
          errData: {}
        })
      } else {
        let obj = {}
        obj[name] = errors.message
        this.setData({
          errData: obj
        })

      }
    })
  },
  checkForm: function(callbak) { // 验证所有表单
    this.selectComponent('#form').validate((valid, errors) => {
      if (!valid) {
        let obj = {}
        errors.forEach(item => {
          obj[item.name] = item.message
        })
        this.setData({
          errData: obj
        })
      }
      //  else {
      //   $wuxToptips().success({
      //     hidden: false,
      //     text: '',
      //     duration: 1000,
      //     success() {},
      //   })
      //   }
    })
    if(callbak) {
      callbak()
    }
  },
  checkId: function() { // 身份核验
    this.checkForm(() => {
      if(JSON.stringify(this.data.errData) != "{}") {
        return false
      }
      let idInfo = this.data.formData
      checkIdentity(idInfo).then(res =>{
        if(res.code == 0) {
          $wuxToptips().warn({
            text: '核验失败，请输入正确数据或联系管理员录入'
          })
        }
        if (res.code == 1) {
          $wuxToptips().success({
            text: '验证成功'
          })
          this.setData({
            classInfo: res.data
          })
          this.setData({
            disNextBtn: false
          })
        }
      })
    })
  },
  formSubmit: function (e) { // 表单提交
    this.checkForm(()=> {
      if(JSON.stringify(this.data.errData) != "{}") {
        return false
      }
      let userInfo = this.data.formData
      userInfo.classId = this.data.classInfo.classId
      userInfo.openid = this.data.openid
      if (App.globalData.userInfo) {
        userInfo.userInfo = App.globalData.userInfo
      }
      register(userInfo).then(res => {
        if(res.err_code == 0) {
          wx.showToast({
            title: '身份认证成功',
          })
          checkOpenid(this.data.openid).then(res => {
            wx.setStorage({
              data: res,
              key: 'bindInfo',
              success: ()=> {
                App.globalData.bindInfo = res
                wx.switchTab({url: '/pages/profile/profile'})
              }
            })
          })
        }
      })
    })
  },
  getCaptcha: function () { // 获取验证码
    if (this.data.disCaptchaBtn) {
      return false
    }
    this.selectComponent('#form').validateField("tel", (valid, errors) => {
      if (! valid) {
        $wuxToptips().warn({
          text: '请先输入正确的手机号',
          duration: 1000
        })
        return false
      }
      // 检查手机号是否被使用过
      checkTel(this.data.formData.tel).then(res => {
        if (res.status == 0) {
          this.setData({
            disCaptcha: false,
            disCaptchaBtn: true
          })
          getSmsCode(this.data.formData.tel).then(data => {
            if (data.code == 0) {
              this.setData({
                captcha: data
              })
              wx.showToast({
                title: '验证码发送成功，请及时查收',
                icon: "none"
              })
              return
            }
            wx.showToast({
              title: '验证码发送失败，请及稍后再试',
              icon: "none"
            })
          }).catch(()=> {
            wx.showToast({
              title: '验证码发送失败，请及稍后再试',
              icon: "none"
            })
          })
          const interval = setInterval(() => {
            this.setData({
              time: this.data.time - 1
            })
            if (this.data.time < 1) {
              clearInterval(interval)
              this.setData({
                disCaptchaBtn: false,
                time: 60
              })
            }
          }, 1000)
        }
        if(res.status == 1) {
          $wuxToptips().warn({
            text: '手机号已被注册',
            duration: 1000
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      openid: App.globalData.openid
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