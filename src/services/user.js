module.exports = (app) => {

    const findAll = (filter = {}) => {
        return app.db('users').where(filter).select();
    }

    const save = async (user) => {

        if(!user.name) return { error: 'Nome obrigatório!'}
        if(!user.email) return { error: 'Email obrigatório!'}
        if(!user.password) return { error: 'Password obrigatório!'}

        const userDb = await findAll({email: user.email});
        if(userDb && userDb.length > 0) return {error:'Já existe um usuário cadastrado com esse email!'}

        return app.db('users').insert(user, '*');

    }

    return {
        findAll,
        save
    }

}