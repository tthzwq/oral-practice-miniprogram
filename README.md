# [小黑口语练习](#)
* [预览](#预览)
* [目录结构](#目录结构)
* [运行项目](#运行项目)
    * 后端项目运行
    * 前端微信小程序运行
* [项目部署](http://note.youdao.com/noteshare?id=6447bffd41b815a2e30dc51309bbb09d)
#### 简介
毕业设计 — 基于讯飞开放平台的口语练习系统，前端使用微信小程序开发，后端使用NodeJS开发，数据库采用MongoDB。<br/>
根据[讯飞开放平台](https://www.xfyun.cn/)提供的服务，实现了语音评测、OCR识别、AIUI个人助手等功能。<br/>
由于讯飞提供的免费发音人音色过于生硬，采用了音色相对较好的[腾讯云TTS](https://cloud.tencent.com/product/tts)语音合成,短信验证码也使用[腾讯云SMS](https://cloud.tencent.com/product/sms)服务。翻译与语音转写使用了微信小程序插件：[微信同声传译](https://developers.weixin.qq.com/miniprogram/dev/extended/service/translator.html) 来实现


### 预览
[项目演示视频](https://1810000003.vod2.myqcloud.com/b64e98afvodcq1810000003/65a42da85285890803143537084/2776a92c73713b9b28e5adac.mp4)
![微信扫一扫体验](http://ww1.sinaimg.cn/large/006J9qAtly1gej3usq68nj31bi0hcmy4.jpg)
![image](http://ww1.sinaimg.cn/large/006J9qAtly1geiyvh6u4qj30ea0tvajy.jpg)
![image](http://ww1.sinaimg.cn/large/006J9qAtly1geiyv0b870j30db0s4dju.jpg)
![image](http://ww1.sinaimg.cn/large/006J9qAtly1geiyv5dcjjj30dd0s9tea.jpg)
![image](http://ww1.sinaimg.cn/large/006J9qAtly1geiyvkkpswj30dc0s678v.jpg)
![image](http://ww1.sinaimg.cn/large/006J9qAtly1geiyvodfqtj30db0s73yx.jpg)
![image](http://ww1.sinaimg.cn/large/006J9qAtly1geixrggam0j30u01rcdnf.jpg)

### 目录结构
```
├─backstage     -- 后端文件夹
│  ├─api            -- 网络请求
│  ├─mongo          -- MongoDB数据库
│  │  └─modules         -- 数据库模型
│  ├─public         -- 公共资源
│  ├─route          -- 路由
│  └─views          -- 静态页面
│
└─mini-program     -- 小程序文件夹
    ├─assets            -- 图片等资源
    ├─components        -- 公共组件
    ├─miniprogram_npm   -- 第三方npm
    ├─network           -- 网络请求
    ├─pages             -- 页面
    └─utils             -- 工具函数
```
### 运行项目
#### 后端项目运行
```shell
$ git clone https://github.com/TThz-hz/oral-practice-miniprogram.git
$ cd oral-practice-miniprogram/backstage
$ npm install
$ cd api
// 新建config.js文件 内容如下图
$ cd.>config.js
$ node app.js
```
![image](http://ww1.sinaimg.cn/mw690/006J9qAtly1gej30d4n4cj30gr0k2aid.jpg)
- 打开[腾讯云官网](https://cloud.tencent.com/)进行注册
- 进入[腾讯云API密钥管理](https://console.cloud.tencent.com/cam/capi)复制SecretId与SecretKey到``` oral-practice-miniprogram/backstage/api/config.js ```中。
- 进入[腾讯云SMS短信验证码](https://cloud.tencent.com/product/sms) 根据提示配置（也可自行配置其他平台短信验证码）

#### 前端微信小程序运行请见 [微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html)
``` shell
$ cd oral-practice-miniprogram/mini-program/network
// 新建config.js文件 内容如下图
$ cd.>config.js
```
![image](http://ww1.sinaimg.cn/mw690/006J9qAtly1gej287izq1j30i90rjk3a.jpg)
- 打开 [讯飞开放平台官网](http://www.xfyun.cn/) 进行注册
- 进入[控制台](https://console.xfyun.cn/app/myapp)新建应用
- 添加[相应技能](https://console.xfyun.cn/services/ise)并配置ip白名单
- 复制各技能的 AppID 和 ApiKey  填写到``` oral-practice-miniprogram/mini-program/network/config.js ```中。
