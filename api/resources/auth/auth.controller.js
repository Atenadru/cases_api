const authUtil = require('../../utils/auth.util')
const TABLA = 'auth'
const TABLB = 'tokens_storage'

module.exports = function (injectedmysql) {
  let mysql = injectedmysql
  if (!mysql) {
    throw new Error('Connexion no establecida')
  }

  async function login({ username, password }) {
    const data = await mysql.query(TABLA, { username: username })

    if (data === undefined || data === null) return null

    const isMatch = await authUtil.isMatcPassword(password, data[0].password)
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
  }

  async function singup(username, email, password) {
    const authData = {}

    if (username) authData.username = username
    if (email) authData.email = email
    if (password) authData.password = await authUtil.hashEncrypt(password)

    return mysql.insert(TABLA, authData)
  }

  async function token(req, res, next) {
    const refreshToken = req.headers.authorization

    if (refreshToken === null) return res.sendStatus(401)
    const decoded = authUtil.decodeHeader(refreshToken)

    const id = parseInt(decoded.payload.id)
    mysql
      .get(TABLB, id)
      .then((result) => {
        if (refreshToken == result[0].refresh_token) {
          res.status(200).json({ permitido: true })
          next()
        } else {
          res.status(403).send('no permitido')
          next()
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message,
        })
      })
  }

  return {
    login,
    singup,
    token,
  }
}
