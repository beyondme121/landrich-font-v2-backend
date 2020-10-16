'use strict'

const Service = require('egg').Service

class TabService extends Service {
  async createTab(tab) {
    const { app, ctx } = this
    let TabId = ctx.helper.uuid()
    let CreateTime = ctx.helper.getTime()
    let { TabNameEN, TabNameCN, MenuId, SortKey } = tab
    let res = await app.mysql.insert('tab', {
      TabId,
      TabNameEN,
      TabNameCN,
      MenuId,
      SortKey,
      CreateTime,
    })
    if (res.affectedRows > 0) {
      return {
        code: 0,
        data: {
          TabId,
          TabNameEN,
          TabNameCN,
          MenuId,
          SortKey,
          CreateTime,
        },
      }
    } else {
      return {
        code: -1,
        msg: '创建失败',
      }
    }
  }
  async getTabList() {
    const { app } = this
    let res = await app.mysql.select('tab', {
      orders: [['SortKey', 'asc']],
    })
    if (res.length > 0) {
      return {
        code: 0,
        data: res,
      }
    }
  }

  async getTabMenuMapping() {
    const { app } = this
    let res = await app.mysql.query(`
      SELECT distinct TabNameEN, MenuNameEN 
      FROM nmefc_fcst_portal.tab a inner join nmefc_fcst_portal.menu b on a.MenuId=b.MenuId
      ORDER BY b.SortKey
    `)
    if (res.length > 0) {
      return {
        code: 0,
        data: res,
      }
    }
  }
}

module.exports = TabService
