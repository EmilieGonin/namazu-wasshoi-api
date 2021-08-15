require('dotenv').config();

module.exports = {
  "development": {
    "url": process.env.LOCAL_DATABASE_URL,
    "dialect": "mysql"
  },
  "production": {
    "url": process.env.CLEARDB_DATABASE_URL,
    "dialect": "mysql"
  }
}
