const express = require('express')
const authController = require('./index')
const authRouter = express.Router()

authRouter.get('/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  try {
    authController.login(username, password)
  } catch (error) {
    next()
  }
})

module.exports = authRouter
