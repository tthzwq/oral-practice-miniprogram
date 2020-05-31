const mongoose = require('mongoose')
const {mongoConfig} = require('./backstage/api/config.js')
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
  },
  subjectName: {
    type:String,
    required: true
  },
})
const userSchema = new mongoose.Schema({
  openid: {
    type: String,
    required: true
  },
  studentId: Number,
  teacherId: Number,
  identity: {
    type: Number,
    required: true,
    enum: [0, 1]
  },
  name: {
    type:String,
    required: true
  },
  classId: {
    type: String,
    default: 1234
  },
  tel: {
    type: Number,
    required: true
  }
})
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
const teacherSchema = new mongoose.Schema({
  teacherId: {
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


// 3. 将文档结构发布为模型
const itemBank = mongoose.model('ItemBank', itemBankSchema)
const user = mongoose.model('User', userSchema)
const student = mongoose.model('Student', studentSchema)
const teacher = mongoose.model('Teacher', teacherSchema)

const defaultSubjec = mongoose.model('DefaultSubjec', subjectSchema)
const classSubjec = mongoose.model('ClassSubjec', subjectSchema)


let arr = [
  {
    message: "This kind of air conditioning system is practical and economical for the needs of your company.",
    subjectName: 'd0006'
  },
  {
    message: "Our products are of superb quality as well as the typical oriental make-up. ",
    subjectName: 'd0006'
  },
  {
    message: "Our silk garments are made of super pre silk materials and by traditional silks.",
    subjectName: 'd0006'
  },
  {
    message: "The garments are magnificent and tasteful and have a long enjoyed great fame both at home and abroad. ",
    subjectName: 'd0006'
  },
  {
    message: "As our typewriters are made of light and hard alloy, they are both portable and durable.",
    subjectName: 'd0006'
  },
  {
    message: "As our product has all the features you need and is 20% cheaper compared with that of Japanese make, I strongly recommend it to you.",
    subjectName: 'd0006'
  },
  {
    message: "Vacuum cleaners of this brand are competitive in the international market and are the best-selling products of their Kind. ",
    subjectName: 'd0006'
  },
  {
    message: "Owing to its superior quality and reasonable price, our silk has met with a warm reception and quick sale in most European countries. ",
    subjectName: 'd0006'
  },
  {
    message: "Our goods are greatly appreciated in other markets similar to your own.",
    subjectName: 'd0006'
  },
  {
    message: "How much does it cost to take a taxi to center city?",
    subjectName: 'd0006'
  },
]



// return itemBank.insertMany(arr).then((res) => console.log(res))




















// new teacher({teacherId:1111111111,name: 'admin',classId:0000,classPwd:0000}).save()

// new student({studentId:0000000000,name: '小黑',classId:0000,classPwd:0000}).save()

// new user({openid:"oRoZa5IujQ0WmtnU_BO3c7KkfV1o",studentId:1601103088,name: "郑文强",classId:1234,tel:18337665256,identity:0}).save().then((res)=> {
//   console.log(res);
// }).catch(err => console.log(err))



var time_canvas = 'document.getElementById("time-graph-canvas")';
this.drawMain(time_canvas, 70, "#85d824", "#eef7e4");
/**
 * 
 * @param {*} drawing_elem 绘制对象
 * @param {*} percent 绘制圆环百分比, 范围[0, 100]
 * @param {*} forecolor 绘制圆环的前景色，颜色代码
 * @param {*} bgcolor 绘制圆环的背景色，颜色代码
 */
function drawMain(drawing_elem, percent, forecolor, bgcolor) {

  var context = drawing_elem.getContext("2d");
  var center_x = drawing_elem.width / 2;
  var center_y = drawing_elem.height / 2;
  var rad = Math.PI*2/100;
  var speed = 0;
  
  // 绘制背景圆圈
  function backgroundCircle(){
  context.save();
  context.beginPath();
  context.lineWidth = 8; //设置线宽
  var radius = center_x - context.lineWidth;
  context.lineCap = "round";
  context.strokeStyle = bgcolor;
  context.arc(center_x, center_y, radius, 0, Math.PI*2, false);
  context.stroke();
  context.closePath();
  context.restore();
  }
  
  //绘制运动圆环
  function foregroundCircle(n){
  context.save();
  context.strokeStyle = forecolor;
  context.lineWidth = 8;
  context.lineCap = "round";
  var radius = center_x - context.lineWidth;
  context.beginPath();
  context.arc(center_x, center_y, radius , -Math.PI/2, -Math.PI/2 +n*rad, false); //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
  context.stroke();
  context.closePath();
  context.restore();
  }
  
  //绘制文字
  function text(n){
  context.save(); //save和restore可以保证样式属性只运用于该段canvas元素
  context.fillStyle = forecolor;
  var font_size = 40;
  context.font = font_size + "px Helvetica";
  var text_width = context.measureText(n.toFixed(0)+"%").width;
  context.fillText(n.toFixed(0)+"%", center_x-text_width/2, center_y + font_size/2);
  context.restore();
  }
  
  //执行动画
  (function drawFrame(){
  window.requestAnimationFrame(drawFrame);
  context.clearRect(0, 0, drawing_elem.width, drawing_elem.height);
  backgroundCircle();
  text(speed);
  foregroundCircle(speed);
  if(speed >= percent) return;
  speed += 1;
  }());
  }
