'use strict'
const Controller = require('egg').Controller

class UserController extends Controller {
  async register() {
    const { ctx, service } = this
    const rule = {
      username: { type: 'string', required: true, message: '真实姓名必须填写' },
      email: { type: 'string', required: true, message: '邮箱必须填写' },
      password: { type: 'string', required: true, message: '密码必须填写' },
      company: { type: 'string', required: true, message: '工作单位必须填写' },
    }
    const user = ctx.request.body
    // 1. 校验提交的用户注册信息是否合规
    ctx.validate(rule, user)
    // 2. 校验邮箱是否被注册过
    const userFromDB = await service.user.findUserByEmail(
      user.email.toUpperCase()
    )
    if (userFromDB.code === 0) {
      ctx.body = {
        code: -1,
        msg: '邮箱被占用',
      }
      return
    } else {
      const res = await service.user.createOne(user)
      ctx.body = res
    }
  }

  async login() {
    const { ctx, service } = this
    const rule = {
      email: { type: 'string', required: true, message: '必须填写' },
      password: { type: 'string', required: true, message: '密码必须填写' },
    }
    const loginForm = ctx.request.body
    ctx.validate(rule, loginForm)
    const res = await service.user.login(loginForm)
    ctx.body = res
  }
}

module.exports = UserController
