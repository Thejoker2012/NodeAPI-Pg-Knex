const express = require('express');

module.exports = (app) =>{

    //Modularizando controle de rotas
    //rota /auth /signup
    //rota /auth /signin 
    //app.routes.auth é o caminho do pacote onde estão as rotas
    app.use('/auth', app.routes.auth);

}