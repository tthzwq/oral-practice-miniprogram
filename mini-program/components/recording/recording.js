// components/recording/recording.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    hidden: { // 属性名
      type: Boolean,
      value: false,
      observer:function (newVal, oldVal) {
        // 属性值变化时执行
        this.setData({
          show: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
