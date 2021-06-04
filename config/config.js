require('dotenv').config()
module.exports = {
  api: {
    PORT: process.env.PORT || 80 || 3000,
  },
  jwt: {
    SECRET: process.env.SECRET_KEY,
    REFRESH: process.env.REFRESH_TOKEN,
  },
  mysql: {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    PASSW: process.env.MYSQL_PASS,
    DATABASE: process.env.MYSQL_DB,
  },
}
