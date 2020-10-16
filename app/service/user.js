'use strict'
const jwt = require('jsonwebtoken')
const Service = require('egg').Service

class UserService extends Service {
  // 1. 创建用户(用户注册)
  async createOne(user) {
    const { ctx, app } = this
    let { username, password, email, company } = user
    let userid = ctx.helper.uuid()
    let createtime = ctx.helper.getTime()
    email = email.toUpperCase()
    let insertUser = {
      userid,
      username,
      email,
      password,
      company,
      createtime,
    }
    const res = await app.mysql.insert('user', insertUser)
    if (res.affectedRows > 0) {
      return {
        code: 0,
        msg: '注册成功',
        user: insertUser,
      }
    } else {
      return {
        code: -1,
        msg: '注册失败',
      }
    }
  }

  // 2. 根据邮箱查找用户(场景: 邮箱是否被占用)
  async findUserByEmail(email) {
    const { ctx, app } = this
    const res = await app.mysql.select('user', {
      where: {
        email,
      },
    })
    if (res.length > 0) {
      return {
        code: 0,
        user: res[0],
      }
    } else {
      return {
        code: -1,
        user: null,
      }
    }
  }

  // 3. 登录
  async login({ email, password }) {
    const { service } = this
    console.log('email, password', email, password)
    const userInfo = await this.findUserByEmail(email)
    console.log('userInfo', userInfo)
    if (userInfo.code === -1) {
      return {
        code: -2,
        msg: '用户邮箱不存在，请前去注册',
      }
    }

    if (userInfo.user.password !== password) {
      return {
        code: -1,
        msg: '密码不正确',
      }
    }

    // 1. 生成token
    const token = jwt.sign(
      {
        id: userInfo.user.userid,
        name: userInfo.user.username,
      },
      this.config.jwt.secret,
      {
        expiresIn: '30d',
      }
    )

    // TODO 2. 查找用户id的授权菜单, 查询用户id的所有角色数据
    return {
      code: 0,
      msg: '登录成功',
      ...userInfo,
      token,
    }
  }

  async getUserById(id) {
    let res = await this.app.mysql.get('user', { userid: id })
    return res
  }
}

module.exports = UserService
