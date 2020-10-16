'use strict'

const Controller = require('egg').Controller

class MenuController extends Controller {
  async getMenuList() {
    const { service, ctx } = this
    let res = await service.menu.findAllMenuList()
    if (res.code == 0) {
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

  // 根据菜单名称查询
  async getMenuItemByNameEN() {
    const { service, ctx } = this
    let { name } = ctx.query
    let res = await service.menu.findMenuByMenuName(name)
    if (res) {
      ctx.body = {
        code: 0,
        msg: '菜单名称存在',
      }
    } else {
      ctx.body = {
        code: -1,
        msg: '菜单名称不存在',
      }
    }
  }

  async createMenu() {
    let { ctx, service } = this
    // 校验
    let rule = {
      MenuNameEN: {
        type: 'string',
        required: true,
        message: '菜单名称必须填写',
      },
      MenuPath: {
        type: 'string',
        required: true,
        message: '菜单路径必须填写并不能重复',
      },
    }

    let { MenuNameEN, MenuPath } = ctx.request.body
    ctx.validate(rule, ctx.request.body)
    // 2. 菜单路径或名称是否存在
    let res1 = await service.menu.findMenuByMenuPath(MenuPath)
    let res2 = await service.menu.findMenuByMenuName(MenuNameEN)

    // 如果不存在, 允许创建菜单
    if (res1.code === -1 && res2.code === -1) {
      let res = await service.menu.createMenu(ctx.request.body)
      ctx.body = res
    } else {
      ctx.body = {
        code: -1,
        msg: '菜单名称或菜单路径已经被占用',
      }
    }
  }
}

module.exports = MenuController
