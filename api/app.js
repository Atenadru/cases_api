const express = require('express')
const errors = require('../api/utils/errors.interceptor')
const authRouter = require('./resources/auth/auth.routes')
const app = express()
const morgan = require('morgan')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(morgan('dev'))

app.use('/api/auth/', authRouter)

const data = [{ nombre: 'yorman' }, { apellido: 'urdaneta' }]
app.get('/', (_req, res) => {
  res.json(data)
})

app.use(errors)
module.exports = app
