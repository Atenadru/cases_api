const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../config/config')

function generateToken(payload) {
  return jwt.sign({ payload }, config.jwt.SECRET, { expiresIn: '1h' })
}

function generateRefreshToken(payload) {
  return jwt.sign({ payload }, config.jwt.REFRESH, { expiresIn: '1d' })
}

function verifyToken(token) {
  return jwt.verify(token, config.jwt.SECRET, (err, decode) => {
    if (err) return err.message
    return decode
  })
}

function verifyTokenRefresh(token) {
  return jwt.verify(token, config.jwt.REFRESH, (err, decode) => {
    if (err) return err.message

    return decode
  })
}

async function isMatcPassword(password, hashUser) {
  return await bcrypt.compare(password, hashUser)
}

async function hashEncrypt(password) {
  return await bcrypt.hash(password, 5)
}

function formatFilter(auth) {
  if (!auth) {
    throw error('No viene token', 401)
  }

  if (auth.indexOf('Bearer ') === -1) {
    throw error('Formato invalido', 401)
  }

  let token = auth.replace('Bearer ', '')
  return token
}

function decodeHeader(refreshToken) {
  const token = formatFilter(refreshToken)
  return verifyTokenRefresh(token)
}

module.exports = {
  generateToken,
  generateRefreshToken,
  isMatcPassword,
  hashEncrypt,
  verifyToken,
  formatFilter,
  decodeHeader,
}
