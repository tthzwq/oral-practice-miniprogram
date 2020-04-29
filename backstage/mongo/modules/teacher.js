const mongoose = require('mongoose')

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
    type: String,
    default: 1001
  },
  classPwd: {
    type: Number,
    default: 1001
  }
})

module.exports = mongoose.model('Teacher', teacherSchema)