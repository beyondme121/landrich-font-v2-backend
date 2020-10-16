'use strict'

const Service = require('egg').Service

class ImageCardsService extends Service {
  async getAllImageCards() {
    const { app } = this
    let res = app.mysql.select('menu_card_document', {
      orders: [
        ['class_type', 'asc'],
        ['type', 'asc'],
      ],
    })
    return res
  }

  async getImageCardDetailById(id) {
    const r = await this.app.mysql.select('menu_card_document_item', {
      where: {
        parent_id: id,
      },
    })
    return r
  }

  async getImageCardDetail() {
    const r = await this.app.mysql.query(`
      SELECT  b.id,
              a.title,
              a.path,
              a.coverImg,
              a.type,
              a.class_type,
              a.homepage_type,
              b.title AS detail_title,
              b.imgURLS,
              b.create_time,
              a.sort_key
      FROM nmefc_fcst_portal.menu_card_document a
      INNER JOIN nmefc_fcst_portal.menu_card_document_item b
          ON a.id = b.parent_id
      ORDER BY class_type, type
    `)
    return r
  }

  async createImageCard(card) {
    let {
      title,
      coverImg,
      type,
      class_type,
      homepage_type,
      sortKey, // 主体内容的排序
      detail_title, // 明细信息的标题
      imgURLS, // 明细信息的图片集合
    } = card

    let document_id = this.ctx.helper.uuid()
    // 新增的card都使用uuid作为url, 目前前端没有使用这个path
    let path = '/' + class_type.toLowerCase() + '/' + document_id
    let create_time = this.ctx.helper.getTime()

    // 创建内容主题
    const document = await this.app.mysql.insert('menu_card_document', {
      id: document_id,
      title,
      path,
      coverImg,
      type,
      class_type,
      create_time,
      homepage_type,
      sort_key: sortKey,
    })

    let detail_id = this.ctx.helper.uuid()
    let documentDetail = await this.app.mysql.insert(
      'menu_card_document_item',
      {
        id: detail_id,
        parent_id: document_id,
        title: detail_title,
        imgURLS,
        create_time,
      }
    )

    if (document.affectedRows === 1 && documentDetail.affectedRows === 1) {
      return {
        code: 0,
        data: {
          id: document_id,
          title,
          path,
          coverImg,
          type,
          class_type,
          create_time,
          homepage_type,
          detail_title,
          imgURLS,
          sortKey,
        },
      }
    } else {
      return {
        code: -1,
        msg: '创建内容失败',
      }
    }
  }
}

module.exports = ImageCardsService
