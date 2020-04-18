const mongoose = require('mongoose')
const {mongoConfig} = require('./config.js')
// 连接 MongoDB 数据库
mongoose.connect(mongoConfig.url, mongoConfig.option)
mongoose.connection.on('error', console.error.bind(console, '连接数据库失败 error:'))
mongoose.connection.once('open', () => console.info("连接数据库成功"))
mongoose.Promise = global.Promise;

// 2. 设计文档结构（表结构）
const itemBankSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true // 必须有
  }
})
const userSchema = new mongoose.Schema({
  openid: {
    type: String,
    required: true
  },
  studentId: Number,
  teacherId: Number,
  identity: {
    type: Number,
    required: true,
    enum: [0, 1]
  },
  name: {
    type:String,
    required: true
  },
  classId: {
    type: Number,
    default: 1324
  },
  tel: {
    type: Number,
    required: true
  }
})
const studentSchema = new mongoose.Schema({
  studentId: {
    type: Number,
    required: true
  },
  name: {
    type:String,
    required: true
  },
  classId: {
    type: Number,
    default: 1001
  },
  classPwd: {
    type: Number,
    default: 1001
  }
})
const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: Number,
    required: true
  },
  name: {
    type:String,
    required: true
  },
  classId: {
    type: Number,
    default: 1001
  },
  classPwd: {
    type: Number,
    default: 1001
  }
})
// 3. 将文档结构发布为模型
const itemBank = mongoose.model('ItemBank', itemBankSchema)
const user = mongoose.model('User', userSchema)
const student = mongoose.model('Student', studentSchema)
const teacher = mongoose.model('Teacher', teacherSchema)


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
module.exports.findItemBank = function () {
  return itemBank.find()
}

/**
 * 添加题库
 * @param {object} data 要插入的对象
*/
module.exports.addItemBank = function (data) {
  return new itemBank(data).save()
}