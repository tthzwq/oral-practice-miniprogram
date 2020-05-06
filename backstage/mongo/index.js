const mongoose = require('mongoose')
const {mongoConfig} = require('../api/config.js')
const { formatDate } = require('../Utils.js')
// 连接 MongoDB 数据库
mongoose.connect(mongoConfig.url, mongoConfig.option)
mongoose.connection.on('error', console.error.bind(console, '连接数据库失败 error:'))
mongoose.connection.once('open', () => console.info("连接数据库成功"))
mongoose.Promise = global.Promise;

const itemBank = require("./modules/itemBank")
const user = require("./modules/user")
const student = require("./modules/student")
const teacher = require("./modules/teacher")
const {defaultSubjec, classSubjec} = require("./modules/subject")

/**
 * 查找已认证用户
 * @param {object} object 查寻条件
 */
module.exports.findUser = function (object) {
  return user.findOne(object)
}

/** 检查是否含有该学生 */
module.exports.checkStudent = function (studentInfo) {
  return student.findOne(studentInfo)
}

/** 检查是否含有该教师 */
module.exports.checkTeacher = function (teacherInfo) {
  return teacher.findOne(teacherInfo)
}

/** 用户认证 */
module.exports.userRegister = function(userInfo) {
  return new user(userInfo).save()
}

/** 查询题库 */
module.exports.findItemBank = function (subjectName) {
  return itemBank.find({subjectName})
}
/** 查询精选课程列表 */
module.exports.findDSubjecList = function () {
  return defaultSubjec.find()
}
/** 查询班级课程列表 */
module.exports.findCSubjecList = function (classId) {
  return classSubjec.find({name:classId})
}


/**
 * 添加题库
 * @param {object} data 要插入的对象
*/
module.exports.addItemBank = function (data) {
  return new itemBank(data).save()
}


/**
 * 每日打卡
 * @param {String} openid openid
*/
module.exports.addClock = function (openid) {
  return new Promise((resove, reject) => {
    user.findOne({openid}).then(res => {
      const day = (formatDate(new Date()))
      const clock = res.clock
      if (res.clock[clock.length - 1] == day) {
        resove(res)
      }else {
        clock.push(day)
        user.updateOne({openid}, {clock}).then(data => {
          // data : { n: 1, nModified: 1, ok: 1 }
          resove(res)
        }).catch(error => {
          reject(error)
        })
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 查看班级内的学生
 * @param {String} classId 班级ID
*/
module.exports.findStudent = function (classId) {
  console.log(classId)
  return new Promise((resove, reject) => {
    Promise.all([student.find({classId}), user.find({classId,identity:0})]).then(list => {
      resove(list)
      console.log(list)
    }).catch(err => {
      console.log(err)
      reject(err)
    })
  })
}
