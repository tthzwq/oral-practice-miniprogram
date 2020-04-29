//logs.js
const util = require('../../utils/util.js')
const App = getApp()
import { $wuxCalendar } from '../../components/wux-weapp/index.js'


Page({
  data: {
    value2: [],
    logs: []
  },
  onLoad: function () {
    // this.setData({
    //   logs: [ 1586966400000, 1586188800000, 1585756800000, 1586361600000, 1587052800000, 1586448000000, 1586275200000, 1585670400000, 1586102400000].map(log => {
    //     return util.formatTime(new Date(log))
    //   })
    // })
    this.setData({
      logs: App.globalData.bindInfo.data.clock,
    })
    this.show()
  },
  show:function() {
    $wuxCalendar().open({
      value: this.data.logs,
      multiple: true,
      onChange: (values, displayValues) => {
        console.log('onChange', values, displayValues)
        this.setData({
            value2: displayValues,
        })
      },
    })
  }
})
