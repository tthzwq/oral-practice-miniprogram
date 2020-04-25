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
    type: Number,
    default: 1324
  },
  tel: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)