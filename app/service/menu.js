'use strict'

const Service = require('egg').Service

class MenuService extends Service {
  // 根据菜单的英文名查询菜单信息
  async findMenuByMenuPath(path) {
    let { app } = this
    let res = await app.mysql.select('menu', {
      where: {
        MenuPath: path,
      },
    })

    if (res.length > 0) {
      return {
        code: 0,
        data: res[0],
      }
    } else {
      return {
        code: -1,
        data: null,
      }
    }
  }

  // 根据菜单的英文名查询菜单信息
  async findMenuByMenuName(name) {
    let { app } = this
    let res = await app.mysql.select('menu', {
      where: {
        MenuNameEN: name,
      },
    })
    if (res.length > 0) {
      return {
        code: 0,
        data: res[0],
      }
    } else {
      return {
        code: -1,
        data: null,
      }
    }
  }

  async createMenu(menuInfo) {
    const { ctx, app } = this
    let {
      MenuNameEN,
      MenuNameCN,
      MenuDesc,
      MenuPath,
      Type,
      AuthType,
      SortKey,
      ParentMenuId,
    } = menuInfo
    let MenuId = ctx.helper.uuid()
    let CreateTime = ctx.helper.getTime()

    let res = await app.mysql.insert('menu', {
      MenuId,
      MenuNameEN,
      MenuNameCN,
      MenuDesc,
      MenuPath,
      CreateTime,
      Type,
      AuthType,
      SortKey,
      ParentMenuId,
    })
    if (res.affectedRows === 1) {
      return {
        code: 0,
        data: {
          MenuId,
          MenuNameEN,
          MenuNameCN,
          MenuDesc,
          MenuPath,
          CreateTime,
          Type,
          AuthType,
          SortKey,
          ParentMenuId,
        },
      }
    } else {
      return {
        code: -1,
        msg: '创建菜单失败',
      }
    }
  }

  async findAllMenuList() {
    let res = await this.app.mysql.select('menu', {
      orders: [['SortKey', 'asc']],
    })
    if (res.length > 0) {
      return {
        code: 0,
        data: res,
      }
    }
  }
}

module.exports = MenuService
