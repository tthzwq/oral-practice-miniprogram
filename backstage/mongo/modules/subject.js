const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true
  },
  title: {
    type:String,
    required: true
  },
  level: {
    type:String,
    enum: ["初级", "中级", "高级"]
  },
  img: {
    type:String,
    required: true
  }
})

module.exports.defaultSubjec = mongoose.model('DefaultSubjec', subjectSchema)
module.exports.classSubjec = mongoose.model('ClassSubjec', subjectSchema)