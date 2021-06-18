const express = require('express')
const authController = require('./index')
const authRouter = express.Router()

authRouter.post('/login', authController.login)
authRouter.post('/singup', authController.singup)
authRouter.post('/token', authController.token)

module.exports = authRouter
