//Instancia o app com o express
// e ja chama a função express, por isso do parenteses ao final
const app = require('express')();
//Organizador de pacotes
const consign = require('consign');

consign({cwd:'src', verbose:false})
//Inclua o diretório config
.include('./config/middlewares.js')
//Inclua também
.then('./routes/')
//Inclua também
.then('./config/routes.js')
//Dentro do app
.into(app)

//Rota padrão
app.get('/', (req, res)=>{
    res.status(200).send();
})

//Exportando app
module.exports = app;