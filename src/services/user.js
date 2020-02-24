const ValidationError = require('../errors/ValidationErros.js');

module.exports = (app) => {

    const findAll = (filter = {}) => {
        return app.db('users').where(filter).select();
    }

    const save = async (user) => {

        if(!user.name) throw new ValidationError( 'Nome obrigatório!')
        if(!user.email) throw new ValidationError( 'Email obrigatório!')
        if(!user.password) throw new ValidationError( 'Password obrigatório!')

        const userDb = await findAll({email: user.email});
        if(userDb && userDb.length > 0) throw new ValidationError( 'Já existe um usuário cadastrado com esse email!')

        return app.db('users').insert(user, '*');

    }

    return {
        findAll,
        save
    }

}