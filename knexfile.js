const { db } = require('./src/.env')

module.exports = {
  client: 'pg',
  connection: db,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: `${__dirname}/src/database/migrations`
  },
 
};
