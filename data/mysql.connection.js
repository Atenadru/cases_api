const mysql = require('mysql')
const config = require('../config/config')

const dbconf = Object.freeze({
  connectionLimit: 100,
  host: config.mysql.HOST,
  user: config.mysql.USER,
  password: config.mysql.PASSW,
  database: config.mysql.DATABASE,
  debug: false,
})

let pool = mysql.createPool(dbconf)

function list(table) {
  return new Promise((resolve, reject) => {
    pool.query(`SELECT * FROM ${table}`, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

function queryRow(data) {
  return new Promise((resolve, reject) => {
    pool.getConnection((error, conn) => {
      if (error) {
        reject(error)
      }

      let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?'
      let query = mysql.format(selectQuery, [
        data.table,
        data.filed,
        data.condition,
      ])
      conn.query(query, (err, result) => {
        pool.once('acquire', function (connection) {
          console.log('Connection %d acquired', connection.threadId)
        })
        conn.release()
        pool.once('release', function (connection) {
          console.log('Connection %d released', connection.threadId)
        })
        if (err) {
          return reject(err)
        }
        resolve(result)
      })
    })
  })
}

function addRow(table, data) {
  return new Promise((resolve, reject) => {
    let insertQuery = 'INSERT INTO ?? SET ?'
    let query = mysql.format(insertQuery, [table, { ...data }])
    pool.query(query, (err, response) => {
      if (err) {
        reject(err)
        return
      }
      resolve(response.insertId)
    })
  })
}

function upsert(table, data) {
  let insertQuery = 'INSERT INTO ?? SET ? ON DUPLICATE KEY UPDAT SET ?'
  let query = mysql.format(insertQuery, [table, { ...data }])
  pool.query(query, (err, response) => {
    if (err) {
      console.error(err)
      return
    }
    // rows added
    console.log(response.insertId)
  })
}

function updateRow(table, data) {
  return new Promise((resolve, reject) => {
    pool.query(
      `UPDATE ${table} SET ? WHERE id=?`,
      [data, data.id],
      (err, result) => {
        if (err) return reject(err)
        resolve(result)
      }
    )
  })
}

function query(table, query, join) {
  let joinQuery = ''
  if (join) {
    const key = Object.keys(join)[0]
    const val = join[key]
    joinQuery = `JOIN ${key} ON ${table}.${val} = ${key}.id`
  }

  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`,
      query,
      (err, res) => {
        if (err) return reject(err)
        resolve(res || null)
      }
    )
  })
}

module.exports = {
  list,
  queryRow,
  addRow,
  upsert,
  updateRow,
  query,
}
