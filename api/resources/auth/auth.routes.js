const express = require('express')
const authController = require('./index')
const authRouter = express.Router()
const response = require('../utils/response')

authRouter.get('/login', (req, res, next) => {
  authController
    .login(req.body.username, req.body.password)
    .then((data) => {
      response.success(req, res, data[0].email, 200)
    })
    .catch(next)
})

module.exports = authRouter
