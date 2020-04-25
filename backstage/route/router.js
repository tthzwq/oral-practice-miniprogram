const tts = require('../api/tts.js')
const sms = require('../api/sms.js')
const mongo = require('../mongo/index.js')
const {getOpenid} = require('../api/login.js')
const express = require('express')
const path = require('path')
const fs = require('fs')
const router = express.Router()

// console.log(req.session)  //查看session
// req.session.destroy()  //注销session
// req.session.XXXXX=XXX;	// 往session里存储数据

// console.log('Cookies: ', req.cookies)  // Cookies that have not been signed 尚未签名的cookie
// console.log('Signed Cookies: ', req.signedCookies)  // Cookies that have been signed 已签名的cookie

// 渲染首页 
router.get('/home', (req,res,next) => {
  fs.readFile(path.join(__dirname, '../views/index.html'), 'utf8', function (err, data) {
    if (err) {
      return next(err)
    }
    res.send(data)
  })
})

// 获取openId 
router.post('/openid', (req,res,next) => {
  if (req.body.code) {
    getOpenid(req.body.code).then(data => {
      res.json({err_code:0,openid: data.openid})
    }).catch(err => {
      return next(err)
    })
  }else {
    res.status(400).json({err_code:400, message:"参数错误"})
  }
})

// 检查用户是否认证 
router.get('/openid', (req,res,next) => {
  if (req.query.openid) {
    mongo.checkOpenid(req.query.openid).then(data => {
      if(! data) {
        res.json({bind: false})
      }else {
        res.json({bind: true,data})
      }
    })
  }else {
    res.status(400).json({err_code:400, message:"参数错误"})
  }
})

// 用户认证 
router.post('/register', (req, res,next) => {
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
    res.json({err_code: 0, message: "success"})
  }).catch((err)=> {
    return next(err)
  })
})

// 获取题库 
router.get('/item', (req, res,next) => {
  if(req.query.subjectName) {
    mongo.findItemBank(req.query.subjectName).then(data => {
      res.json({err_code: 0, message: "success",data})
    }).catch(err => {
      return next(err)
    })
    return
  }
  res.status(400).json({err_code:400, message:"参数错误"})
})

router.get('/subjectList', (req,res) => {
  Promise.all([mongo.findDSubjecList(), mongo.findCSubjecList()]).then(list => {
    res.json({code:0,message:"success",data:list})
  }).catch(err => {
    return next(err)
  })
})

// tts语音合成 
router.post('/tts', (req,res,next) => {
  tts(req.body).then(data => {
    res.json(data)
  }).catch(err => {
    return next(err)
  })
})

// 验证手机号是否被使用 
router.get('/tel', (req, res,next) => {
  mongo.checkTel(req.query.tel).then(data => {
    if (data == null) {
      res.json({status: 0})
    }else {
      res.json({status: 1,data})
    }
  }).catch(err => {
    return next(err)
  })
})

// 验证数据库内是否含有该学生/教师 
router.get('/identity', (req, res,next) => {
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
      return next(err)
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
      return next(err)
    })
  }else {
    res.status(400).json({err_code:400, message:"参数错误"})
  }
})

// SMS短信验证码 
router.get('/sms', (req, res,next) => {
  sms(req.query.tel).then(data => {
    res.json(data)
  }).catch(err => {
    return next(err)
  })
})
module.exports = router
