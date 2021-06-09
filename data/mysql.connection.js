const mysql = require('mysql')
const config = require('../config/config')

const dbconf = Object.freeze({
  host: config.mysql.HOST,
  user: config.mysql.USER,
  password: config.mysql.PASSW,
  database: config.mysql.DATABASE,
})

let connection

function handleConnection() {
  connection = mysql.createConnection(dbconf)

  connection.connect((err) => {
    if (err) {
      console.error('[db err]', err)
      setTimeout(handleConnection, 2000)
    } else {
      console.log('DB Connected!')
    }
  })

  connection.on('error', (err) => {
    console.error('[db err]', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleConnection()
    } else {
      throw err.message
    }
  })
}

handleConnection()

/* 
! mysql consultas abajo
*/

function list(table) {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${table}`, (err, data) => {
      if (err) return reject(err)
      resolve(data)
    })
  })
}

function get(table, id) {
  return new Promise((resolve, reject) => {
    connection.query(
      `SELECT * FROM ${table} WHERE user_fk='${id}'`,
      (err, data) => {
        if (err) return reject(err)
        resolve(data)
      }
    )
  })
}

function insert(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO ${table} SET ?`, data, (err, result) => {
      if (err) return reject(err)
      resolve(result)
      console.log('RESULTADO', result)
    })
  })
}

function update(table, data) {
  return new Promise((resolve, reject) => {
    connection.query(
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
    connection.query(
      `SELECT * FROM ${table} ${joinQuery} WHERE ${table}.?`,
      query,
      (err, res) => {
        if (err) {
          reject(err.message)
        }
        resolve(res || null)
      }
    )
  })
}

function getRrefreshn() {
  let id = parseInt(3)
  let sql = `sp_get_refresh_token(${id})`

  return connection.query(sql, (error, results, fields) => {
    if (error) {
      return console.error(error)
    }

    console.log(results[0])
  })
}

module.exports = {
  list,
  get,
  insert,
  update,
  query,
  getRrefreshn,
}
