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

  // 根据明细表id反查主表的id
  async getImageCardIdByDetailId(id) {
    const r = await this.app.mysql.select('menu_card_document_item', {
      where: {
        id,
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
      sort_key, // 主体内容的排序
      detail_title, // 明细信息的标题
      imgURLS, // 明细信息的图片集合
    } = card

    let document_id = this.ctx.helper.uuid()
    // 新增的card都使用uuid作为url, 目前前端没有使用这个path
    let path = '/' + class_type.toLowerCase() + '/' + document_id
    // let path = '/' + class_type.toLowerCase() + '/' + coverImg
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
      sort_key,
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
          sort_key,
        },
      }
    } else {
      return {
        code: -1,
        msg: '创建内容失败',
      }
    }
  }

  async deleteImageCardById(id) {
    let detail = await this.getImageCardIdByDetailId(id)
    // 删除明细数据
    let res1 = await this.app.mysql.delete('menu_card_document_item', {
      id,
    })
    // 删除主体数据
    let res2 = await this.app.mysql.delete('menu_card_document', {
      id: detail[0].parent_id,
    })

    if (res1.affectedRows === 1 && res2.affectedRows === 1) {
      return {
        code: 0,
      }
    }
  }

  async updateImageCardById(id, card) {
    let { app } = this
    console.log('id, card', id, card)
    let detail = await this.getImageCardIdByDetailId(id)

    let {
      title,
      coverImg,
      type,
      class_type,
      create_time,
      homepage_type,
      detail_title,
      imgURLS,
      sort_key, // 主体card的排序字段
    } = card
    // 更新明细
    const updateItemRow = {
      id: id,
      title: detail_title,
      imgURLS,
    }
    let res1 = await app.mysql.update('menu_card_document_item', updateItemRow)
    console.log('detail, ', detail)
    // 更新主体
    let updateDocumentRow = {
      id: detail[0].parent_id,
      title,
      coverImg,
      type,
      class_type,
      create_time,
      homepage_type,
      sort_key,
    }
    let res2 = await app.mysql.update('menu_card_document', updateDocumentRow)

    console.log('------', res1, res2)

    if (res1.affectedRows === 1 && res2.affectedRows === 1) {
      return {
        code: 0,
      }
    } else {
      return {
        code: -1,
      }
    }
  }
}

module.exports = ImageCardsService
