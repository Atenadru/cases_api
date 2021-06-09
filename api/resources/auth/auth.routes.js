const express = require('express')
const authController = require('./index')
const authRouter = express.Router()
const response = require('../../utils/response')

authRouter.post('/login', (req, res, next) => {
  authController
    .login({ username: req.body.username, password: req.body.password })
    .then((token) => {
      response.success(req, res, token, 200)
    })
    .catch(next)
})

authRouter.post('/token', authController.token)

authRouter.post('/singup', (req, res, next) => {
  console.log(req.body.username, req.body.email, req.body.password)
  authController
    .singup(req.body.username, req.body.email, req.body.password)
    .then((data) => {
      response.success(req, res, data, 200)
    })
    .catch(next)
})

module.exports = authRouter
