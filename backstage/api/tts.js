const tencentcloud = require("tencentcloud-sdk-nodejs");
// 导入对应产品模块的client models。
const {tencentConfig} = require('./config.js')
const TtsClient = tencentcloud.tts.v20190823.Client;
const models = tencentcloud.tts.v20190823.Models;
const Credential = tencentcloud.common.Credential;
const ClientProfile = tencentcloud.common.ClientProfile;
const HttpProfile = tencentcloud.common.HttpProfile;

/**
 * TTS语音合成
 * @param text  合成语音的源文本 必填
 * @param sessionId 类似于uuid的字符串防止重复 必填
 * @param codec 返回音频格式 选填 可取值 mp3(默认) wav
 * @param speed 语速 选填 默认0 范围 -2~2
 * @param voiceType 音色 选填 默认1050英文男 1051英文女
 * @param volume 音量大小 选填 默认为0代表正常音量 范围 0~10
 * @param region 地域列表 选填 ap-beijing ap-chengdu ap-chongqing ap-guangzhou ap-shanghai
 * @returns {Promise} Promise
*/
module.exports = function tts ({text, sessionId, codec='wav', speed=0, voiceType=1050, volume=0, region='ap-shanghai'}) {
  let config = {
    /** 云API密钥 SecretId*/
    SecretId: tencentConfig.SecretId,
    /** 云API密钥 SecretKey*/
    SecretKey: tencentConfig.SecretKey,
    /** 合成语音的源文本*/
    Text:text,
    /** 返回音频格式，可取值 wav(默认) mp3 */
    Codec:codec,
    /** 主语言类型：1-中文(默认) 2-英文*/
    PrimaryLanguage:2,
    /** 项目id，用户自定义，默认为0*/
    ProjectId:0,
    /** 音频采样率：16000：16k (默认)  8000：8k*/
    SampleRate:16000,
    /** 语速，范围：[-2，2]*/
    Speed:speed,
    /** 音色 5-云小欣，情感女声 1050英文男 1051英文女 */
    VoiceType:voiceType,
    /** 音量大小，范围：[0，10] 默认为0代表正常音量*/
    Volume:volume,
    /** 一次请求对应一个SessionId，会原样返回，建议传入类似于uuid的字符串防止重复*/
    SessionId:sessionId,
    /**  地域列表 ap-beijing ap-chengdu ap-chongqing 	ap-guangzhou ap-shanghai*/
    Region:region,
    /** 模型类型，1-默认模型 */
    ModelType:1,
  }
  // 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey
  let cred = new Credential(config.SecretId, config.SecretKey);
  let httpProfile = new HttpProfile();
  httpProfile.endpoint = "tts.tencentcloudapi.com";
  let clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  // 实例化要请求产品(tts)的client对象
  let client = new TtsClient(cred, config.Region, clientProfile);
  // 实例化一个请求对象
  let req = new models.TextToVoiceRequest();
  let params = {
    Text: config.Text,
    SessionId: config.SessionId,
    Volume: config.Volume,
    Speed: config.Speed,
    ProjectId: config.ProjectId,
    ModelType: config.ModelType,
    VoiceType: config.VoiceType,
    PrimaryLanguage: config.PrimaryLanguage,
    SampleRate: config.SampleRate,
    Codec: config.Codec
  }
  req.from_json_string(JSON.stringify(params));
  // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
  return new Promise((resolve, reject) => {
    client.TextToVoice(req, function(errMsg, response) {
        // 请求异常返回，打印异常信息
        if (errMsg) {
          reject(errMsg);
          return;
        }
        // 请求正常返回,response对象
        resolve(response);
    });
  })
} 
