const mongoose = require('mongoose')

const itemBankSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true // 必须有
  },
  subjectName: {
    type:String,
    required: true
  },
})

module.exports = mongoose.model('ItemBank', itemBankSchema)