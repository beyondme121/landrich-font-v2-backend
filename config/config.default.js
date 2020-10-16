/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602489345280_4721'

  // add your middleware config here
  config.middleware = ['jwt']

  // 1. POST请求,关闭csrf
  config.security = {
    csrf: {
      enable: false,
    },
  }

  // 2. 数据库连接
  config.mysql = {
    client: {
      host: 'localhost',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'nmefc_fcst_portal',
    },
    app: true,
    agent: false,
  }

  // 3. jwt 密钥
  config.jwt = {
    secret: 'egg-api-jwt',
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig,
  }
}
