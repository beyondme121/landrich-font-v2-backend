'use strict'
const prefix = '/api'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app
  router.get('/', controller.home.index)

  // ========================= 1. 用户行为 =========================
  // 用户注册
  router.post(`${prefix}/user/register`, controller.user.register)
  // 登录
  router.post(`${prefix}/user/login`, controller.user.login)

  // ========================= 2. 菜单管理(一级菜单) =========================
  // 1. 获取所有菜单列表
  router.get(`${prefix}/menu`, controller.menu.getMenuList)
  // 2. 根据菜单名称查询某个菜单
  router.get(`${prefix}/menu/byMenuNameEN`, controller.menu.getMenuItemByNameEN)
  // 3. 创建菜单
  router.post(`${prefix}/menu`, controller.menu.createMenu)

  // ========================= 3. 内容管理(图片Card, 图片资源请求(包含主信息和明细图片信息)) =========================
  // 4. 创建某个一项预报产品
  router.post(`${prefix}/image-cards`, controller.imageCard.createCard)
  // 5. 根据id更新card信息
  router.put(`${prefix}/image-cards`, controller.imageCard.updateCard)

  // 5. 获取所有一级菜单下的明细card数据
  router.get(`${prefix}/image-cards`, controller.imageCard.getImageCards)
  // 6. 获取某个card里面的detail配置,包括card中图片数组
  router.get(
    `${prefix}/image-cards-detail`,
    controller.imageCard.getImageCardDetailById
  )
  // 7. 获取所有image信息(通过关联查询方式)
  router.get(
    `${prefix}/image-cards-detail-all`,
    controller.imageCard.getImageCardDetail
  )
  // 8. 删除某个card信息
  router.delete(
    `${prefix}/image-cards-by-id`,
    controller.imageCard.deleteImageCardById
  )
  // ========================= 4. Tab管理(菜单下的Tab) =========================
  router.post(`${prefix}/tab`, controller.tab.createTab)
  router.get(`${prefix}/tab-list`, controller.tab.getTabList)
  router.get(`${prefix}/tab-menu-mapping`, controller.tab.getTabMenuMapping)
}
