require('dotenv').config();

module.exports = {
  development: {
    url: process.env.LOCAL_DATABASE_URL,
    dialect: "mysql",
    logging: false,
    timezone: "Europe/Paris"
  },
  production: {
    url: process.env.JAWSDB_MARIA_URL,
    dialect: "mysql",
    logging: false,
    timezone: "Europe/Paris"
  }
}
