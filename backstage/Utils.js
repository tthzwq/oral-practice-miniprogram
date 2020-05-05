module.exports.debounce = function (fun, delay) {/* 防抖函数 */
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fun.apply(this, args)
    }, delay)
  }
}

/**
 * 转化时间戳
 * @param {Date} date Date 对象
 * @param {*} fmt 时间格式 默认'yyyy-MM-dd'
 */
module.exports.formatDate = function (date, fmt = 'yyyy-MM-dd') {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(
        RegExp.$1, 
        (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length)
      );
    }
  }
  return fmt;
};

