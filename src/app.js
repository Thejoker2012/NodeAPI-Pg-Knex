//Instancia o app com o express
// e ja chama a função express, por isso do parenteses ao final
const app = require('express')();
//Organizador de pacotes
const consign = require('consign');
//Import do gerenciador de migrates ddo banco knex
const knex = require('knex');
//Import do arquivo de configuração e criação das migrations
const knexfile = require('../knexfile.js');
//log de migrations
const knexlogger = require('knex-logger');

//Criar chaveamento dinâmico
app.db = knex(knexfile.test);

app.use(knexlogger(app.db));

consign({cwd:'src', verbose:false})
//Inclua o diretório config
.include('./config/middlewares.js')
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

//Exportando app
module.exports = app;