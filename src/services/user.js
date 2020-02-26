const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/ValidationErros.js');

module.exports = (app) => {

    const findAll = () => {
        return app.db('users').select(['id', 'name', 'email']);
    }

    const findOne = (filter = {}) => {
        return app.db('users').where(filter).first();
    }

    //Criptografia de senha vinda do cliente com bcrypt
    const getPasswordHash = (password) => {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    const save = async (user) => {

        if(!user.name) throw new ValidationError( 'Nome obrigatório!')
        if(!user.email) throw new ValidationError( 'Email obrigatório!')
        if(!user.password) throw new ValidationError( 'Password obrigatório!')

        const userDb = await findOne({email: user.email});
        console.log('UserDb',userDb)
        if(userDb) throw new ValidationError( 'Já existe um usuário cadastrado com esse email!')
        console.log('UserDb',userDb)

        //Cria  um novo usuário passando todas as propriedades de user para newUser
        //Usando operador spread para pegar os atributos de user e colocar em newUser
        const newUser = {...user};
        //Passando a senha gerada com bcrypt para a variáve user.password
        newUser.password = getPasswordHash(user.password);
        console.log('newUser',newUser)
        return app.db('users').insert(newUser, ['id', 'name', 'email']);

    }

    return {
        findAll,
        findOne,
        save
    }

}