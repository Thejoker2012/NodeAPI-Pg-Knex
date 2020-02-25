//Instancia o app com o express
// e ja chama a função express, por isso do parenteses ao final
const app = require('express')();
//Organizador de pacotes
const consign = require('consign');
//Import do gerenciador de migrates ddo banco knex
const knex = require('knex');
//Import do arquivo de configuração e criação das migrations
const knexfile = require('../knexfile.js');

//Criar chaveamento dinâmico
app.db = knex(knexfile.test);

consign({cwd:'src', verbose:false})
//Inclua o diretório config
.include('./config/passport.js')
//Inclua o diretório config
.then('./config/middlewares.js')
//Inclua também
.then('./services')
//Inclua também
.then('./routes')
//Inclua também
.then('./config/routes.js')
//Dentro do app
.into(app)


//Rota padrão
app.get('/', (req, res)=>{
    res.status(200).send();
})

//Midleware de retorno de Erro!
app.use((err, req, res, next)=>{
    const {name,message,stack} = err;
    if (name ==='ValidateError') res.status(400).json({error:message})
    else res.status(500).json({name,message,stack})
    next(err);
})

//Exportando app
module.exports = app;