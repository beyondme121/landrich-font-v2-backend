'use strict'

const Controller = require('egg').Controller

class TabController extends Controller {
  async createTab() {
    const { ctx, service } = this
    let body = ctx.request.body
    let res = await service.tab.createTab(body)
    if (res.code === 0) {
      ctx.body = {
        code: 0,
        data: res.data,
      }
    } else {
      ctx.body = {
        code: -1,
        msg: res.msg,
      }
    }
  }
  async getTabList() {
    const { ctx, service } = this
    let res = await service.tab.getTabList()
    if (res.code === 0) {
      ctx.body = {
        code: 0,
        data: res.data,
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '查无数据',
      }
    }
  }

  async getTabMenuMapping() {
    const { ctx, service } = this
    let res = await service.tab.getTabMenuMapping()
    if (res.code === 0) {
      ctx.body = {
        code: 0,
        data: res.data,
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '查无数据',
      }
    }
  }
}

module.exports = TabController
