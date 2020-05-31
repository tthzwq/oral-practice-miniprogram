const mongoose = require('mongoose')

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
    type: String,
    default: 1001
  },
  classPwd: {
    type: Number,
    default: 1001
  }
})

module.exports = mongoose.model('Student', studentSchema)
