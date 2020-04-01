const tts = require('../api/tts.js')
const mong = require('../api/mongoose.js')
const express = require('express')
const router = express.Router()

/** 获取题库 */
router.get('/item', (req, res) => {
  mong.findItemBank().then(data => {
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

module.exports = router
