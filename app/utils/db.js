const mysql = require('mysql')
const config = require('../../config/dbconfig')

let pool = mysql.createPool({
  host: config.host,
  port: config.port,
  user: config.user,
  password: config.password,
  database: config.database,
  multipleStatements: true,
})

let query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err)
      } else {
        connection.query(sql, values, (err, fields) => {
          if (err) reject(err)
          else resolve(fields)
          connection.release()
        })
      }
    })
  })
}

module.exports = query
