// pages/sentence/sentence.js
import {baseURL} from '../../network/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordList: []
  },
  //将毫秒的时间转换成美式英语的时间格式,eg:3rd May 2018
  formatDate: function (millinSeconds){
    const date = new Date(millinSeconds);
    const monthArr = new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
    // const suffix = new Array("st","nd","rd","th");
    const year = date.getFullYear(); //年
    const month = monthArr[date.getMonth()]; //月
    const ddate = date.getDate(); //日
    // if(ddate % 10 < 1 || ddate % 10 > 3) {
    //   ddate = ddate + suffix[3];
    // }else if(ddate % 10 == 1) {
    //   ddate = ddate + suffix[0];
    // } else if(ddate % 10 == 2) {
    //   ddate = ddate + suffix[1];
    // }else {
    //   ddate = ddate + suffix[2];
    // }
    // return ddate + " "+ month + " " + year;
    return {
      day: ddate,
      date: month + " " + year
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let nowDate = new Date().getTime()
    this.setData({
      wordList: [
        {
          img: baseURL + '/public/img/daily/01.jpg',
          en: 'Hope is a good thing, maybe the best of things. And no good thing ever dies. ',
          zh: '希望是一件好事，也许是人间至善，而美好的事永不消逝。',
          author: '《肖申克的救赎》',
          day:this.formatDate( nowDate - 24*60*60*1000*6).day,
          date: this.formatDate( nowDate - 24*60*60*1000*6).date
        },
        {
          img: baseURL + '/public/img/daily/02.jpg',
          en: 'We can love completely without complete understanding.',
          zh: '我们可以全心全意去爱我们不完全理解的人。',
          author: '《大河恋》',
          day:this.formatDate( nowDate - 24*60*60*1000*5).day,
          date: this.formatDate(nowDate - 24*60*60*1000*5).date
        },
        {
          img: baseURL + '/public/img/daily/03.jpg',
          en: "Life's hard. It's supposed to be. If we didn't suffer, we'd never learn anything.",
          zh: '生活是艰辛的，它本该就是这样的。如果我们不经历痛苦，我们就永远也不会学到东西。',
          author: '《爱在日落黄昏时》',
          day:this.formatDate( nowDate - 24*60*60*1000*4).day,
          date: this.formatDate(nowDate - 24*60*60*1000*4).date
        },
        {
          img: baseURL + '/public/img/daily/04.jpg',
          en: 'Nothing can help us endure dark times better than our faith. ',
          zh: '没有什么比信念更能支撑我们度过艰难的时光了。',
          author: '《纸牌屋》',
          day:this.formatDate( nowDate - 24*60*60*1000*3).day,
          date: this.formatDate(nowDate - 24*60*60*1000*3).date
        },
        {
          img: baseURL + '/public/img/daily/05.jpg',
          en: 'Death is so final, whereas life is so full of possibilities.',
          zh: '死了可什么都没了，而活着就有无限的可能。',
          author: '《权力的游戏》',
          day:this.formatDate( nowDate - 24*60*60*1000*2).day,
          date: this.formatDate(nowDate - 24*60*60*1000*2).date
        },
        {
          img: baseURL + '/public/img/daily/06.jpg',
          en: 'You can change your life if you want to. Sometimes you have to be hard on yourself, but you can change it completely.',
          zh: '有志者事竟成。有时虽劳其筋骨，但命运可以彻底改变。',
          author: '《唐顿庄园》',
          day:this.formatDate( nowDate - 24*60*60*1000*1).day,
          date: this.formatDate(nowDate - 24*60*60*1000*1).date
        },
        {
          img: baseURL + '/public/img/daily/07.jpg',
          en: 'Life is like a box of chocolates, you never know what you are going to get.',
          zh: '生活就像一盒巧克力,你永远不知道下一个是什么。',
          author: '《阿甘正传》',
          day:this.formatDate( nowDate - 24*60*60*1000*0).day,
          date: this.formatDate(nowDate - 24*60*60*1000*0).date
        }
      ]
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})