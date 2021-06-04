const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('../../config/config')

function generateToken(payload) {
  return jwt.sign({ payload }, config.jwt.SECRET, { expiresIn: '1h' })
}

function generateRefreshToken(payload) {
  return jwt.sign({ payload }, config.jwt.REFRESH)
}

async function isMatcPassword(password, hashUser) {
  const match = await bcrypt.compare(password, hashUser)
  return match
}

function hashEncrypt(password) {
  return bcrypt.hash(password, 5)
}

module.exports = {
  generateToken,
  generateRefreshToken,
  isMatcPassword,
  hashEncrypt,
}
