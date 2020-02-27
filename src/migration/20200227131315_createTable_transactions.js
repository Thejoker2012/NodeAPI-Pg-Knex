
exports.up = (knex) => {
    return knex.schema.createTable('transactions', (transactions)=>{
      transactions.increments('id').primary();
      transactions.string('description').notNull();
      transactions.enum('type', ['I', 'O']).notNull();
      transactions.date('date').notNull();
      transactions.decimal('ammount',15,2).notNull();
      transactions.boolean('status').notNull().default(false);
      transactions.integer('acc_id').notNull()
        .references('id')
        .inTable('accounts')
        .notNull();
    })
  };
  
  exports.down = (knex) => {
    return knex.schema.dropTable('transactions');
  };
  