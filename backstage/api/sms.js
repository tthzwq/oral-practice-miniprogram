const tencentcloud = require("tencentcloud-sdk-nodejs");
const {tencentConfig, smsConfig} = require('./config.js')
const smsClient = tencentcloud.sms.v20190711.Client;
const models = tencentcloud.sms.v20190711.Models;

const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

/** 云API密钥 SecretId*/
const  SecretId = tencentConfig.SecretId
/** 云API密钥 SecretKey*/
const  SecretKey = tencentConfig.SecretKey
let cred = new Credential(SecretId, SecretKey);
/* 非必要步骤:
 * 实例化一个客户端配置对象，可以指定超时时间等配置 */
let httpProfile = new HttpProfile();
httpProfile.endpoint = "sms.tencentcloudapi.com";
// 实例化一个client选项，可选的，没有特殊需求可以跳过。
let clientProfile = new ClientProfile();

clientProfile.httpProfile = httpProfile;

/* SDK会自动指定域名。通常是不需要特地指定域名的，但是如果你访问的是金融区的服务
 * 则必须手动指定域名，例如sms的上海金融区域名： sms.ap-shanghai-fsi.tencentcloudapi.com
 * 实例化要请求产品(以sms为例)的client对象
 * 第二个参数是地域信息，可以直接填写字符串ap-guangzhou，或者引用预设的常量 */
let client = new smsClient(cred, "ap-shanghai", clientProfile);

/* 实例化一个请求对象，根据调用的接口和实际情况，可以进一步设置请求参数
 * 你可以直接查询SDK源码确定SendSmsRequest有哪些属性可以设置
 * 属性可能是基本类型，也可能引用了另一个数据结构
 * 推荐使用IDE进行开发，可以方便的跳转查阅各个接口和数据结构的文档说明 */
let req = new models.SendSmsRequest();

/* 基本类型的设置:
 * SDK采用的是指针风格指定参数，即使对于基本类型你也需要用指针来对参数赋值。
 * SDK提供对基本类型的指针引用封装函数
 * 帮助链接：
 * 短信控制台: https://console.cloud.tencent.com/sms/smslist
 * sms helper: https://cloud.tencent.com/document/product/382/3773 
*/

/**
 * sms短信验证码
 * @param {String} tel  手机号 必填
 * @param {String} templateId 模板 ID 默认578978绑定手机号  579001解绑手机号 
 * @returns {Promise} Promise
*/
module.exports = function sms(tel, templateId="578978") {
  // 随机验证码
  let smsCode = Math.random().toString().slice(-6)
  let phoneNumberSet = ['+86'+tel]
  let templateParamSet = [smsCode, '5']
  let params = {
    // 短信应用ID
    SmsSdkAppid:smsConfig.SmsSdkAppid,
    // 下发手机号码，采用 e.164 标准，+[国家或地区码][手机号]
    PhoneNumberSet: phoneNumberSet,
    // 模板 ID
    TemplateID:templateId,
    // 短信签名内容
    Sign:"小黑口语",
    // 模板参数 ["验证码", "有效时间"]
    TemplateParamSet:templateParamSet,
    /* 用户的 session 内容: 可以携带用户侧 ID 等上下文信息，server 会原样返回 */
    // SessionContext = ""
  }
  req.from_json_string(JSON.stringify(params));
  
  // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
  return new Promise((resove, reject) => {
    // if(! tel) {
    //   reject({err: "请输入手机号"})
    //   return
    // } 
    // client.SendSms(req, function (err, response) {
    //   // 请求异常返回异常信息
    //   if (err) {
    //     reject(err)
    //   }else if(response.SendStatusSet[0].Code == 'Ok'){
    //     // 请求正常返回验证码
        resove({code:0,tel,smsCode})
    //   }else{
    //     resove(response)
    //   }
    // })
  })

}