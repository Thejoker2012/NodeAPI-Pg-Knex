
exports.up = (knex) => {
    return knex.schema.createTable('accounts', (accounts)=>{
      accounts.increments('id').primary();
      accounts.string('name').notNull();
      //Uma conta tem um usuário
      //Um usuário pode ter várias contas
      //
      accounts.integer('user_id') //O campo user_id
        .references('id') //Referencia o ID da tabela Users
        .inTable('users') //Referencia na tabela User
        .notNull(); //não pode ser nullo
    })
  };
  
  exports.down = (knex) => {
    return knex.schema.dropTable('accounts');
  };
  