//Instancia o app com o express
// e ja chama a função express, por isso do parenteses ao final
const app = require('express')();

app.get('/', (req, res)=>{
    res.status(200).send();
})

module.exports = app;