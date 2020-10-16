'use strict'

const Controller = require('egg').Controller

class ImageCardController extends Controller {
  async getImageCards() {
    const { ctx, service } = this
    const r = await service.imageCards.getAllImageCards()
    ctx.body = {
      code: 0,
      data: r,
    }
  }

  async getImageCardDetailById() {
    const { ctx, service } = this
    const { id } = ctx.query
    let r = await service.imageCards.getImageCardDetailById(id)
    ctx.body = {
      code: 0,
      data: r,
    }
  }

  async getImageCardDetail() {
    const { ctx, service } = this
    let r = await service.imageCards.getImageCardDetail()
    ctx.body = {
      code: 0,
      data: r,
    }
  }

  //
  async createCard() {
    const { ctx, service } = this
    let body = ctx.request.body
    body.class_type = body.class_type.toLowerCase()
    let r = await service.imageCards.createImageCard(body)
    if (r.code == 0) {
      ctx.body = {
        code: 0,
        data: r.data,
      }
    } else {
      ctx.body = r
    }
  }
}

module.exports = ImageCardController
