const authUtil = require('../../utils/auth.util')
const response = require('../../utils/response')
const TABLA = 'auth'
const TABLB = 'tokens_storage'

module.exports = function (injectedmysql) {
  let mysql = injectedmysql
  if (!mysql) {
    throw new Error('Connexion no establecida')
  }

  async function login(req, res, _next) {
    const username = req.body.username
    const password = req.body.password
    const data = await mysql.queryRow({
      table: TABLA,
      filed: 'username',
      condition: username,
    })
    try {
      console.log('[Data: ]', data)
      if (Object.keys(data).length == 0) throw 'Unauthorized'

      const isMatch = await authUtil.isMatcPassword(password, data[0].password)
      if (isMatch) {
        const payload = {
          id: data[0].id_user,
          username: username,
        }
        const token = authUtil.generateToken({ ...payload })
        const refresh = authUtil.generateRefreshToken({ ...payload })
        const tokenStorage = {
          access_token: token,
          refresh_token: refresh,
          user_fk: data[0].id_user,
        }
        const result = await mysql.addRow(TABLB, tokenStorage)
        console.log(result)
        response.success(req, res, { token: token, refreshToken: refresh }, 200)
      } else {
        throw 'Unauthorized'
      }
    } catch (err) {
      response.error(req, res, err, 401)
    }
  }

  async function singup(req, res, next) {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    const authData = {}
    try {
      if (username) authData.username = username
      if (email) authData.email = email
      if (password) authData.password = await authUtil.hashEncrypt(password)

      const result = await mysql.addRow(TABLA, authData)
      console.log(result)
      if (parseInt(result) >= 1) {
        response.success(req, res, `the id returned was ${result}`, 200)
      } else {
        throw 'it was not saved in the database,consult with de admin'
      }
    } catch (error) {
      response.error(req, res, error, 500)
    }
  }

  async function token(req, res, next) {
    const refreshHeaderToken = req.headers.authorization
    if (refreshHeaderToken === null || refreshHeaderToken === undefined)
      return res.sendStatus(401)
    const decoded = authUtil.decodeHeader(refreshHeaderToken)
    console.log(`[OUTPUT Decode: ] ${JSON.stringify(decoded)}`)
    if (decoded == 'invalid signature') {
      response.error(req, res, 'Access Forbidden', 403)
    }
    const id = parseInt(decoded.payload.id)
    mysql
      .queryRow({ table: TABLB, filed: 'user_fk', condition: id })
      .then((result) => {
        const cleanToken = authUtil.formatFilter(refreshHeaderToken)
        if (cleanToken == result[0].refresh_token) {
          const newToken = authUtil.generateToken({ ...decoded })
          response.success(req, res, newToken, 200)
        } else {
          response.success(req, res, 'Access Forbidden', 403)
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
