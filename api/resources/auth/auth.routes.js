const express = require('express')
const { authenticateToken } = require('../../utils/token.interceptor')
const authController = require('./index')
const authRouter = express.Router()


authRouter.post('/login', authController.login)
authRouter.post('/singup', authController.singup)
authRouter.post('/token', authController.token)

authRouter.post('/saludo',authenticateToken,(req,res,next)=>{
    res.send(`<h1>Estas logeado ${JSON.stringify(req.user,null,2)} </h1>`)
})

module.exports = authRouter
