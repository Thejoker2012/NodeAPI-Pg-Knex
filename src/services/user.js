module.exports = (app) => {

    const findAll = () => {
        return app.db('users').select();
    }

    const save = (user) => {
        
        if(!user.name) return { error: 'Nome obrigatório!'}
        if(!user.email) return { error: 'Email obrigatório!'}
        if(!user.password) return { error: 'Senha obrigatório!'}

        return app.db('users').insert(user, '*');

    }

    return {
        findAll,
        save
    }

}