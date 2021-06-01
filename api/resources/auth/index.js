const mysql = require('../../../data/mysql.connection')
const ctrl = require('./auth.controller')

module.exports = ctrl(mysql)
