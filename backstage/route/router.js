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

/** 获取openId */
router.post('/openid', (req,res) => {
  if (req.body.code) {
    getOpenid(req.body.code).then(data => {
      res.json({openid: data.openid})
    }).catch(err => {
      res.json(err)
    })
  }else {
    res.status(400).send('<h1>参数错误<h1>')
  }
})

/** 检查用户是否认证 */
router.get('/openid', (req,res) => {
  if (req.query.openid) {
    mongo.checkOpenid(req.query.openid).then(data => {
      if(! data) {
        res.json({bind: false})
      }else {
        res.json({bind: true,data})
      }
    })
  }else {
    res.status(400).send('<h1>参数错误<h1>')
  }
})

/** 用户认证 */
router.post('/register', (req, res) => {
  let userInfo = {
    classId: req.body.classId,
    openid: req.body.openid,
    name: req.body.name,
    tel: req.body.tel,
    identity: req.body.identity
  }
  if(req.body.identity == 0) {
    userInfo.studentId = req.body.studentId
  }else if (req.body.identity == 1){
    userInfo.teacherId = req.body.teacherId
  }
  mongo.userRegister(userInfo).then(() => {
    res.json({code: 1, message: "success"})
  }).catch(()=> {
    res.status(500).send('Server error')
  })
})

/** 获取题库 */
router.get('/item', (req, res) => {
  mongo.findItemBank().then(data => {
    res.json(data)
  }).catch(err => {
    res.status(500).send('Server error')
  })
})

/** tts语音合成 */
router.post('/tts', (req,res) => {
  tts(req.body).then(data => {
    res.json(data)
  }).catch(err => {
    res.status(500).send('Server error')
  })
})

/** 验证手机号是否被使用 */
router.get('/tel', (req, res) => {
  mongo.checkTel(req.query.tel).then(data => {
    if (data == null) {
      res.json({status: 0})
    }else {
      res.json({status: 1,data})
    }
  }).catch(err => {
    res.status(500).send('Server error')
  })
})

/** 验证数据库内是否含有该学生/教师 */
router.get('/identity', (req, res) => {
  if (req.query.identity == '0') {
    let studentInfo = {
      name: req.query.name,
      studentId: req.query.studentId
    }
    mongo.checkStudent(studentInfo).then(data => {
      if(data == null) {
        res.json({code: 0})
      }else {
        res.json({code: 1,data})
      }
    }).catch(err => {
      res.status(500).send('Server error')
    })
  }else if (req.query.identity == '1') {
    let teacherInfo = {
      name: req.query.name,
      teacherId: req.query.teacherId
    }
    mongo.checkTeacher(teacherInfo).then(data => {
      if(data == null) {
        res.json({code: 0})
      }else {
        res.json({code: 1,data})
      }
    }).catch(err => {
      res.status(500).send('Server error')
    })
  }else {
    res.status(400).send('<h1>参数错误<h1>')
  }
})

/** SMS短信验证码 */
router.get('/sms', (req, res) => {
  sms(req.query.tel).then(data => {
    res.json(data)
  }).catch(err => {
    res.status(500).send('Server error')
  })
})
module.exports = router
