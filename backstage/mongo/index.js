const mongoose = require('mongoose')
const {mongoConfig} = require('../api/config.js')
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

/** 检查是否含有该学生 */
module.exports.checkStudent = function (studentInfo) {
  return student.findOne(studentInfo)
}

/** 检查是否含有该教师 */
module.exports.checkTeacher = function (teacherInfo) {
  return teacher.findOne(teacherInfo)
}

/** 检查该用户是否认证 */
module.exports.checkOpenid = function (openid) {
  return user.findOne({openid})
}

/** 检查该手机号是否占用 */
module.exports.checkTel = function (tel) {
  return user.findOne({tel})
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
module.exports.findCSubjecList = function () {
  return classSubjec.find()
}


/**
 * 添加题库
 * @param {object} data 要插入的对象
*/
module.exports.addItemBank = function (data) {
  return new itemBank(data).save()
}