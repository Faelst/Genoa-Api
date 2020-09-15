//const {connection} = require('./ConnectDbKeys.js')
const path = require('path')

module.exports = {
  client: "mysql",
  connection: {
    database: 'genoa_seguros',
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'admin'
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'DataBase', 'Migrations'),
    tableName: 'knex_migrations'
  },
};