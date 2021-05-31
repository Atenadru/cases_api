require('dotenv').config()
module.exports = {
  api: {
    PORT: process.env.PORT,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  mysql: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_DB,
  },
}
