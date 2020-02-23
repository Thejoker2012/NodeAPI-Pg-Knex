//Instancia o app com o express
// e ja chama a função express, por isso do parenteses ao final
const app = require('express')();

app.get('/', (req, res)=>{
    res.status(200).send();
})

app.get('/users', (req, res)=>{
    const users = [
        {name: 'Iago', email:'iago@email.com'}
    ]
    res.status(200).json(users);
})

module.exports = app;