const express = require('express')
const app = express()
app.use(express.json())

const data = [{ nombre: 'yorman' }, { apellido: 'urdaneta' }]

app.get('/', (req, res) => {
  res.json(data)
})

module.exports = app
