
exports.up = (knex) => {
  return knex.schema.createTable('users', (user)=>{
    user.increments('id').primary();
    user.string('name').notNull();
    user.string('email').notNull().unique();
    user.string('password').notNull();
  })
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
