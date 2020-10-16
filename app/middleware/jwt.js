const jwt = require('jsonwebtoken')
const whiteList = ['/api/user/login', '/api/user/register']

module.exports = (options) => {
  return async function (ctx, next) {
    let token =
      ctx.request.header.authorization &&
      ctx.request.header.authorization.slice(7)
    let method = ctx.method.toLowerCase()
    if (!token) {
      // 如果请求路径在白名单中,不需要登录即可请求
      if (whiteList.includes(ctx.path)) {
        await next()
      } else if (ctx.path.startsWith('/public')) {
        await next()
      } else {
        ctx.throw(401, '未登录, 请先登录!(由egg的中间件jwt处理)')
      }
    } else {
      let decode
      try {
        decode = jwt.verify(token, options.secret)
        if (!decode || !decode.id) {
          ctx.throw(401, '没有权限，请登录')
        }
        if (Date.now() - decode.expire > 0) {
          ctx.throw(401, 'Token已过期')
        }
        let user = await ctx.service.user.getUserById(decode.id)
        if (user) {
          ctx.state.user = user
          await next()
        } else {
          ctx.throw(401, '用户信息验证失败')
        }
      } catch (e) {
        ctx.throw('500', {
          errorMessage: e.message,
          errors: e.errors,
          msg: '服务器发生错误',
        })
        return
      }
    }
  }
}
