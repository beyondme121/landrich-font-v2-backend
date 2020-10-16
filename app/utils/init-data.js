// 解析 config/website.config.js, 把所有的图片配置信息加载到数据库中
const uuid = require('uuid').v4
const moment = require('moment')
const config = require('../../config/website.config')
const db = require('./db')

Object.keys(config).forEach((key) => {
  let data = config[key]
  data.forEach(async (item) => {
    let { title, path, coverImg, type } = item
    let id = uuid()
    let sql = `
      insert into menu_card_document(id, title, path, coverImg, type, class_type, create_time)
      values('${id}', '${title}','${path}','${coverImg}','${type}','${key}','${moment().format(
      'YYYY-MM-DD HH:mm:ss'
    )}')
    `
    await db(sql)
    item.children.forEach(async (_item) => {
      let { title, imgURLS } = _item
      let parent_id = id
      let _id = uuid()
      // console.log('++++', parent_id, _id, title, imgURLS.join(','))
      let sql = `
        insert into menu_card_document_item(parent_id, id, title, imgURLS, create_time)
        values('${parent_id}','${_id}','${title}','${imgURLS.join(
        ','
      )}','${moment().format('YYYY-MM-DD HH:mm:ss')}')
      `
      await db(sql)
    })
  })
})
console.log('done')
