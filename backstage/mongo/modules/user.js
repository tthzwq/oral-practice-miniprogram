const mongoose = require('mongoose')

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
    type: String,
    default: 1324
  },
  tel: {
    type: Number,
    required: true
  },
  clock: {
    type: Array,
    default: []
  },
  userInfo: {
    type: Object
  }
})

module.exports = mongoose.model('User', userSchema)