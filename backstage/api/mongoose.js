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

// 3. 将文档结构发布为模型
const itemBank = mongoose.model('itemBank', itemBankSchema)

/**
 * 查询题库
*/
module.exports.findItemBank = function () {
  return new Promise((resove, reject) => {
    itemBank.find((err, data) => {
      if (err) {
        reject(err)
      }
      resove(data)
    })
  })
}

// /**
//  * 添加题库
//  * @param {object} data 要插入的对象
// */
// module.exports.addItemBank = function (data) {
//   return new Promise((resove, reject) => {
//     new itemBank(data).save( err => {
//       if (err) {
//         reject(err)
//       }
//       resove()
//     })
//   })
// }