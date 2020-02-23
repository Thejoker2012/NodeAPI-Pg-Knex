//Instancia o app com o express
// e ja chama a função express, por isso do parenteses ao final
const app = require('express')();
//Organizador de pacotes
const consign = require('consign');

consign({cwd:'src'})
.include('./config/middlewares.js')
.into(app)

app.get('/', (req, res)=>{
    res.status(200).send();
})

app.get('/users', (req, res)=>{
    const users = [
        {name: 'Iago', email:'iago@email.com'}
    ]
    res.status(200).json(users);
})

app.post('/users', (req, res)=>{
    res.status(201).json(req.body);
})

module.exports = app;