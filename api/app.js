const express = require('express')
const authRouter = require('./resources/auth/auth.routes')
const app = express()
const morgan = require('morgan')
app.use(express.json())

app.use(morgan('dev'))
app.use('/api/auth/', authRouter)

const data = [{ nombre: 'yorman' }, { apellido: 'urdaneta' }]
app.get('/', (req, res) => {
  res.json(data)
})

module.exports = app
