const authUtil = require('../../utils/auth.util')
const response = require('../../utils/response')
const TABLA = 'auth'
const TABLB = 'tokens_storage'

module.exports = function (injectedmysql) {
  let mysql = injectedmysql
  if (!mysql) {
    throw new Error('Connexion no establecida')
  }

  async function login({ username, password }) {
    const data = await mysql.queryRow({
      table: TABLA,
      filed: 'username',
      condition: username,
    })

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

    return mysql.addRow(TABLA, authData)
  }

  async function token(req, res, next) {
    const refreshHeaderToken = req.headers.authorization
    if (refreshHeaderToken === null || refreshHeaderToken === undefined)
      return res.sendStatus(401)

    const decoded = authUtil.decodeHeader(refreshHeaderToken)
    console.log(`[OUTPUT Decode: ] ${JSON.stringify(decoded)}`)
    if (decoded == 'invalid signature') {
      return res.status(403).json({ Message: 'Access Forbidden' })
    }
    const id = parseInt(decoded.payload.id)
    mysql
      .queryRow({ table: TABLB, filed: 'user_fk', condition: id })
      .then((result) => {
        if (refreshHeaderToken == result[0].refresh_token) {
          const newToken = authUtil.generateToken({ ...decoded })
          res.status(200).json({ token: newToken })
        } else {
          res.status(403).json({ error: 'Access Forbidden' })
        }
      })
      .catch(next)
  }

  return {
    login,
    singup,
    token,
  }
}
