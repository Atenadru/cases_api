const bcrypt = require('bcrypt')
const TABLA = 'users'

module.exports = function (injectedmysql) {
  let mysql = injectedmysql
  if (!mysql) {
    throw new Error('Connexion no establecida')
  }

  function login(req, res) {
    res.json(JSON.stringify({ username: 'username', password: password }))
  }

  return {
    login,
  }
}
