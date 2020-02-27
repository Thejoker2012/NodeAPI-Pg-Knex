const ValidationError = require('../errors/ValidationErros.js');

module.exports = (app) => {
    
    const findAll = (user_id) => {
        return app.db('accounts').where({user_id});
    }

    const findOne = (filter={}) => {
        return app.db('accounts').where(filter).first();
    }
    
    const save = async (account) => {
        if(!account.name) throw new ValidationError('Account name obrigatório!')
        const accountDB = await findOne({name:account.name, user_id:account.user_id})
        if(accountDB) throw new ValidationError('Já existe uma conta com esse nome!')
        return app.db('accounts').insert(account, '*');
    }


    const update = (id, account) => {
        return app.db('accounts')
        .where({id})
        .update(account, '*')
    }

    const remove = (id) => {
        return app.db('accounts')
        .where({id})
        .delete()
    }

    return {
        save,
        findAll,
        findOne,
        update,
        remove
    }
}