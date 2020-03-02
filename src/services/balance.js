module.exports = (app) => {

    const getSaldo = (userId) => {
        //Retornar a soma das transactions
        return app.db('transactions as t').sum('ammount')
        //Onde a coluna id da tabela accounts é igual
        //Ao id da tabela transactions t na coluna acc_id
        .join('accounts as acc', 'acc.id', '=', 't.acc_id')
        //Onde na coluna user_id que tem o valor de userId
        //E na coluna status com valores true
        .where({user_id: userId, status: true})
        //Onde na coluna date for menor ou igual a data atual
        .where('date', '<=', new Date())
        //Selecionar os ids da tabela accounts
        .select('acc.id')
        //Agrupar os id's da tabela accounts acc
        .groupBy('acc.id')
        //Ordenar os id's da tabela accounts acc
        .orderBy('acc.id')
    }

    return {
        getSaldo
    }
}