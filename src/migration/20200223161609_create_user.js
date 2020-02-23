
exports.up = (knex) => {
  return knex.schema.createTable('users', (user)=>{
    user.increments('id').primary();
    user.string('name').notNull();
    user.string('email').notNull();
    user.string('password').notNull().unique();
  })
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
