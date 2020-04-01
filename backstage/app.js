const express = require('express')
const bodyParser = require('body-parser')
const router = require('./route/router.js')
const path = require('path')
const app = express()
app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(router)

app.listen(3000, () => console.log('express running...'))
