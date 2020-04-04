import {baseURL, iseConfig, ocrConfig, ttsConfig, AIUIconfig} from './config.js'
import { post, get } from './promise.js'
const Base64 = require('js-base64').Base64
const MD5 = require('js-md5')
const App = getApp()

/**
 * 获取题库
 * @returns {Promise} 返回Promise实例
*/
export function getItemBank () {
  return get({
    url: baseURL + '/item'
    // url: 'http://127.0.0.1:3000' + '/item'
  })
}

/**
 * 获取测评结果
 * @param {String} text 测评文本 必填
 * @param {String} path 音频文件路径 必填
 * @returns {Promise} 返回Promise实例
*/
export function getIse(text, path) {
  let ts = parseInt(new Date().getTime() / 1000)
  /**
    * 系统配置
  */
  let config = {
    hostUrl: iseConfig.url,
    appid: iseConfig.appid,
    apiKey: iseConfig.apiKey,
    file: path,
    paper: text
  }

  /**
    * 组装业务参数
  */
  function getXParamStr() {
    let xParam = {
      aue: "raw",      // 音频编码
      result_level: "entirety",      // 结果级别
      language: "en_us",      // 语种
      category: "read_sentence",      // 评测种类
      extra_ability: "multi_dimension"  //全维度测评，需开通全维度权限
    }
    return Base64.encode(JSON.stringify(xParam))
  }

  /**
    * 组装请求头
  */
  function getReqHeader() {
    let xParamStr = getXParamStr()
    let xCheckSum = MD5(config.apiKey + ts + xParamStr).toString()
    return {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'X-Appid': config.appid,
      'X-CurTime': ts + "",
      'X-Param': xParamStr,
      'X-CheckSum': xCheckSum
    }
  }
  
  /**
    * 组装postBody
  */
  function getPostBody() {
    let audio = App.FileSystem.readFileSync(config.file, 'base64')
    return {
      audio: audio,
      text: config.paper
    }
  }
  let options = {
    url: config.hostUrl,
    headers: getReqHeader(),
    form: getPostBody()
  }
  return post({
    url: options.url,
    data: options.form,
    header: options.headers
  })
}

/**
 * OCR文字识别
 * @param {String} imgFile 图片路径 必填
 * @param {String} option 印刷体识别(general) 手写体识别(handwriting)
 * @returns {Promise} 返回Promise实例
*/
export function getOCR(imgFile, option = 'general') {
  let ts = parseInt(new Date().getTime() / 1000)
  /**
    * 系统配置
  */
  let config = {
    hostUrl: ocrConfig.url + option,
    appid: ocrConfig.appid,
    apiKey: ocrConfig.apiKey,
    file: imgFile
  }

  /**
    * 组装业务参数
  */
  function getXParamStr() {
    let xParam = {
      language: "cn|en",      // 语言
      // location: "true"      // 是否返回文本位置信息
    }
    return Base64.encode(JSON.stringify(xParam))
  }

  /**
    * 组装请求头
  */
  function getReqHeader() {
    let xParamStr = getXParamStr()
    let xCheckSum = MD5(config.apiKey + ts + xParamStr).toString()
    return {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'X-Appid': config.appid,
      'X-CurTime': ts + "",
      'X-Param': xParamStr,
      'X-CheckSum': xCheckSum
    }
  }

  /**
    * 组装postBody
  */
  function getPostBody() {
    let image = App.FileSystem.readFileSync(config.file, 'base64')
    return {
      image: image
    }
  }
  let options = {
    url: config.hostUrl,
    headers: getReqHeader(),
    form: getPostBody()
  }
  return post({
    url: options.url,
    data: options.form,
    header: options.headers
  })
}

/**
 * 获取TTS语音合成
 * @param {object} option 语音合成的参数对象
 * @ option.text：合成语音的源文本(必填)，
 * @ option.sessionId：类似于uuid的字符串防止重复 必填，
 * @ option.codec：返回音频格式 选填 可取值 mp3(默认) wav，
 * @ option.speed：语速 选填 默认0 范围 -2~2，
 * @ option.voiceType：音色 选填 默认1050英文男 1051英文女 5情感女声，
 * @ option.volume：音量大小 选填 默认为0代表正常音量 范围 0~10，
 * @ option.region：地域列表 选填 ap-beijing ap-chengdu ap-chongqing ap-guangzhou ap-shanghai
*/
export function getTts(option) {
  return new Promise((resolve, reject) => {
    post({
      url: ttsConfig.url,
      // url: 'http://127.0.0.1:3000' + '/tts',
      data: option
    }).then(res => {
      let savedFilePath = wx.env.USER_DATA_PATH +'/tts/'+ res.SessionId.slice(-4)+'.wav'
      App.FileSystem.writeFile({
        filePath: savedFilePath,
        data: res.Audio,
        encoding: 'base64',
        success: () => resolve(savedFilePath),
        fail: err => reject(err)
      })
    }).catch(err => reject(err))
  })
}

/** 
 * AIUI 智能语音助手
 * @param {String} filePath 语音或文本路径
 * @param {String} text 文本
*/
export function AIUI(text) {
  console.log(text)
  let ts = parseInt(new Date().getTime() / 1000)
  let config = {
    hostUrl: AIUIconfig.url,
    appid: AIUIconfig.appid,
    apikey: AIUIconfig.apikey,
    // file: filePath
    text: text
  }
  function getXParamStr() {
    let xParam = {
      "scene": "main_box",
      /** 用户唯一ID 32位字符串，包括英文小写字母与数字 */
      "auth_id": "2049a1b2fdedae553bd03ce6f4820ac4",
      /** 数据类型，可选值：text（文本），audio（音频）*/
      // "data_type": "audio",
      "data_type": "text",
      // /** 结果级别 plain（精简），complete（完整）*/
      "result_level": "complete",
      // /** 是否清除交互历史 auto（不清除）、user（清除） */
      // "clean_dialog_history": "auto"
    }
    return Base64.encode(JSON.stringify(xParam))
  }
  /** 相关参数JSON串经Base64编码后的字符串 */
  function getReqHeader() {
    let xParamStr = getXParamStr()
    /** MD5(apikey + curTime + param)，MD5哈希计算（32位小写）*/
    let xCheckSum = MD5(config.apikey + ts + xParamStr)
    return {
      'X-Appid': config.appid,
      'X-CurTime': ts+"",
      'X-Param': xParamStr,
      'X-CheckSum': xCheckSum
    }
  }
  function getPostBody() {
    return App.FileSystem.readFileSync(config.file)
  }
  
  let options = {
    url: config.hostUrl,
    headers: getReqHeader(),
    form: wx.base64ToArrayBuffer(Base64.encode(text))
    // form: getPostBody()
  }
  return post({
    url: options.url,
    data: options.form,
    header: options.headers
  })
}