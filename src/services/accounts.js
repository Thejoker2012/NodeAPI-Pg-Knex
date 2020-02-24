module.exports = (app) => {

    const save = async (account) => {
        if(!account.name) return {error:'Account name obrigatório!'}
        return app.db('accounts').insert(account, '*');
    }

    const findAll = () => {
        return app.db('accounts');
    }

    const findOne = (filter={}) => {
        return app.db('accounts').where(filter).first();
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