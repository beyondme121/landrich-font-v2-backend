const { v1: uuidv1 } = require('uuid')
const moment = require('moment')

exports.uuid = () => {
  return uuidv1()
}

// 格式化时间, 输出
exports.formatTime = (time) => moment(time).format('YYYY-MM-DD HH:mm:sss')
// 生成时间
exports.getTime = () => moment().format('YYYY-MM-DD HH:mm:ss')
