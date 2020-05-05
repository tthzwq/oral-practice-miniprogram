/**
 * 格式化时间戳
 * @param {*} date 时间戳
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
  // + ' ' + [hour, minute, second].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}


// [1585756800000, 1586361600000, 1587052800000, 1586448000000, 1586275200000, 1585670400000, 1586102400000].map(log => {
//   return util.formatTime(new Date(log))
// })