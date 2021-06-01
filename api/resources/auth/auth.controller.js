const bcrypt = require('bcrypt')
const TABLA = 'users'

module.exports = function (injectedmysql) {
  let mysql = injectedmysql
  if (!mysql) {
    throw new Error('Connexion no establecida')
  }

  async function login(username, password) {
    const data = await mysql.query(TABLA, { username: username })
    console.log(data[0].email)
    if (password === data[0].password) {
      // Generar token;
      return { ...data }
    } else {
      throw new Error('Informacion invalida')
    }
  }

  return {
    login,
  }
}
