module.exports = (app)=> {
    const findOne = (userId, filter = {}) => {
        return app.db('transactions')
        .join('accounts', 'accounts.id', 'acc_id')
        .where(filter)
        .andWhere('accounts.user_id','=',userId)
        .select();
    }

    return {
        findOne
    }
}