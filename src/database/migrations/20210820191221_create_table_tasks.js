
exports.up = knex => knex.schema.createTable('tasks',table => {
    table.increments('id').primary()
    table.string('desc').notNull()
    table.datetime('estimate_at')
    table.datetime('done_at')
    table.integer('userId').references('id')
         .inTable('users').notNull()
});

exports.down = knex => knex.schema.dropTable('tasks');
                      

