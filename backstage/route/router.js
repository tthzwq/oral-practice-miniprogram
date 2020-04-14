const tts = require('../api/tts.js')
const sms = require('../api/sms.js')
const mongo = require('../api/mongoose.js')
const {getOpenid} = require('../api/login.js')
const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

router.get('/', (req,res) => {
  fs.readFile(path.join(__dirname, '../views/index.html'), 'utf8', function (err, data) {
    if (err) {
      res.status(500).send('Server error')
    }
    res.send(data)
  })
})
/** login */
router.post('/openid', (req,res) => {
  if (req.body.code) {
    getOpenid(req.body.code).then(data => {
      res.send(data.openid)
    }).catch(err => {
      res.send(err)
    })
  }else {
    res.status(400).send('参数错误')
  }
})

/** 获取题库 */
router.get('/item', (req, res) => {
  mongo.findItemBank().then(data => {
    res.send(data)
  }).catch(err => {
    res.status(500).send('Server error')
  })
})
/** tts语音合成 */
router.post('/tts', (req,res) => {
  tts(req.body).then(data => {
    console.log(data);
    // data.Audio
    res.send(data)
  }).catch(err => {
    res.status(500).send('Server error')
  })
})

router.get('/sms', (req, res) => {
  sms(req.query.tel).then(data => {
    res.send(data)
  }).catch(err => {
    res.status(500).send('Server error')
  })
})
module.exports = router
