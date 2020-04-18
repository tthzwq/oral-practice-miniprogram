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
    default: 1234
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


// new teacher({teacherId:1234567890,name: '王老师',classId:1234,classPwd:4321}).save()
// new student({studentId:1601101234,name: '小明',classId:1234,classPwd:4321}).save()
new user({openid:"oRoZa5IujQ0WmtnU_BO3c7KkfV1o",studentId:1601103088,name: "郑文强",classId:1234,tel:18337665256,identity:0}).save().then((res)=> {
  console.log(res);
  
}).catch(err => console.log(err))
