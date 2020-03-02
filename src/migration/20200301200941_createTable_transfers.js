exports.up = (knex) => {

    const first = knex.schema.createTable('transfers', (t) => {
        t.increments('id').primary();
        t.string('description').notNull();
        t.date('date').notNull();
        t.decimal('ammount', 15, 2).notNull();
        t.integer('acc_ori_id')
            .references('id')
            .inTable('accounts')
            .notNull();
        t.integer('acc_dest_id')
            .references('id')
            .inTable('accounts')
            .notNull();
        t.integer('user_id')
            .references('id')
            .inTable('users')
            .notNull();
    })

    const second = knex.schema.table('transactions', (t) => {
        t.integer('transfer_id')
            .references('id')
            .inTable('transfers');
    })

    return Promise.all([first,second])
        
};
  
exports.down = (knex) => {

    const first = knex.schema.table('transactions', (t) => {
        t.dropColumn('transfer_id');
    })
    
    const second = knex.schema.dropTable('transfers');

    return Promise.all ([first,second])
    
};