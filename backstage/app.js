const express = require('express')
const session = require("express-session");
const MongoStore = require('connect-mongo')(session)
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')
const router = require('./route/router.js')
const path = require('path')
const fs = require('fs')
const os = require('os')
const app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cookieParser())

const {mongoConfig} = require("./api/config")
app.use(session({
  secret:"TThzwq",		// 设置签名秘钥  内容可以任意填写
  cookie:{maxAge:60*60*24*7},		// 设置cookie的过期时间 单位 S
  resave:false,			// 强制保存，如果session没有被修改也要重新保存
  saveUninitialized:false,		// 未初始化保存 
  rolling:true,
  store: new MongoStore({
      url: mongoConfig.url,
      touchAfter: 24 * 3600          // time period in seconds 时间段（以秒为单位）
  })
}))

app.use(router)

app.get('/video', function (req, res) {
  var time = new Date();
  // var videoName = req.query.name;
  // console.log("-------点击查询下载" + time.getFullYear() + "/" + time.getMonth() + "/" + time.getDate() + "/" + time.getHours() + "/" + time.getMinutes() + "/" + time.getSeconds() + "-------");
  res.writeHead(200, {'Content-Type': 'video/mp4'});
  var rs = fs.createReadStream(path.join(__dirname, './public/mp4/Titanic_01.mp4'));
  rs.pipe(res);

  rs.on('end', function () {
      res.end();
      console.log('end call');
  });
});

app.use((req,res) => {
  fs.readFile(path.join(__dirname, './views/404.html'), 'utf8', function (err, data) {
    if (err) {
      res.status(404).send('<h1>404<h1>')
    }
    res.send(data)
  })
})

app.use((err, req, res, next) => {
  res.status(500).json({
    err_code: 500,
    message: err
  })
})

/**
 * 获取本机IP地址
*/
function getIPAdress() {
  let localIPAddress = "";
  let interfaces = os.networkInterfaces();
  for (let devName in interfaces) {
      let iface = interfaces[devName];
      for (let i = 0; i < iface.length; i++) {
          let alias = iface[i];
          if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
              localIPAddress = alias.address;
          }
      }
  }
  localIp = localIPAddress;
  return localIPAddress;
}

let server = app.listen(3000,() => {
  let host = getIPAdress();
  let port = server.address().port;
  console.log(`express running... 
http://${host}:${port}`)
})
