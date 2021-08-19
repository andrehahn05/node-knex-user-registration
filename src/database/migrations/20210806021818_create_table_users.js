
exports.up = knex => knex.schema.createTable('users', table => {
    table.increments('id').primary();
    table.string('name').notNull();
    table.string('email').notNull().unique();
    table.string('password').notNull();    
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string('token');
    table.string('expToken');
})

exports.down = knex => knex.schema.dropTable('users');