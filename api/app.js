const express = require('express')
const errors = require('../api/utils/errors.interceptor')
const authRouter = require('./resources/auth/auth.routes')
const app = express()
const morgan = require('morgan')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(morgan('dev'))

app.use('/api/auth/', authRouter)
app.use(errors)
const data = [{ nombre: 'yorman' }, { apellido: 'urdaneta' }]
app.get('/', (req, res) => {
  res.json(data)
})

module.exports = app
