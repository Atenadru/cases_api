const http = require('http')
const app = require('./app')
const config = require('../config/config')

const server = http.createServer(app)

server.listen(config.api.PORT, (err) => {
  if (err) return console.log(err.message)
  console.log(`Listening on http:localhost:${config.api.PORT}`)
})
