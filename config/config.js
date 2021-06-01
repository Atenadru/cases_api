require('dotenv').config()
module.exports = {
  api: {
    PORT: process.env.PORT,
  },
  jwt: {
    SECRET: process.env.SECRET_KE,
    REFRESH: process.env.SECRET_KE_TOKEN_REFRSH,
  },
  mysql: {
    HOST: process.env.MYSQL_HOST,
    USER: process.env.MYSQL_USER,
    PASSW: process.env.MYSQL_PASS,
    DATABASE: process.env.MYSQL_DB,
  },
}
