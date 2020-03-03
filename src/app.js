//Instancia o app com o express
// e ja chama a função express, por isso do parenteses ao final
const app = require('express')();
//Organizador de pacotes
const consign = require('consign');
//Import do gerenciador de migrates ddo banco knex
const knex = require('knex');

const winston = require('winston')
const uuid = require('uuidv4')


//Import do arquivo de configuração e criação das migrations
const knexfile = require('../knexfile.js');

//Criar chaveamento dinâmico
app.db = knex(knexfile[process.env.NODE_ENV]);

app.log = winston.createLogger({
    level:'debug',
    transports:[
        new winston.transports.Console({format: winston.format.json({space:1})}),
        new winston.transports.File({filename: 'logs/error.log', level:'warn', format: winston.format.combine(winston.format.timestamp(), winston.format.json({space:1}))})
    ]
})

console.log(process.env.NODE_ENV)

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
.then('./config/router.js')
//Dentro do app
.into(app)


//Rota padrão
app.get('/', (req, res)=>{
    app.log.debug('Passei aqui')
    res.status(200).send();
})

//Midleware de retorno de Erro!
app.use((err, req, res, next)=>{
    const {name,message,stack} = err;
    if (name ==='ValidationError') res.status(400).json({error:message})
    else if (name ==='RecursoIndevidoError') res.status(403).json({error:message})
    else {
        const id = uuid();
        //console.log(message)
        app.log.error(id,name,message,stack)
        res.status(500).json({ id, error: 'Falha interna!'})
    }
    next(err);
})

//Exportando app
module.exports = app;