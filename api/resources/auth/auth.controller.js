const authUtil = require('../../utils/auth.util')
const bcrypt = require('bcrypt')
const TABLA = 'auth'

module.exports = function (injectedmysql) {
  let mysql = injectedmysql
  if (!mysql) {
    throw new Error('Connexion no establecida')
  }

  async function login({ username, password }) {
    const data = await mysql.query(TABLA, { username: username })

    if (data === undefined || data === null) return null
    return bcrypt.compare(password, data[0].password).then((isMatch) => {
      if (isMatch) {
        const payload = {
          id: data[0].id_user,
          username: username,
        }

        const token = authUtil.generateToken({ ...payload })
        const refresh = authUtil.generateRefreshToken({ ...payload })

        return { token: token, refreshToken: refresh }
      } else {
        throw new Error('Informacion invalida')
      }
    })
  }

  async function singup(username, email, password) {
    const authData = {}

    if (username) authData.username = username
    if (email) authData.email = email
    if (password) authData.password = await authUtil.hashEncrypt(password)

    return mysql.insert(TABLA, authData)
  }

  return {
    login,
    singup,
  }
}
