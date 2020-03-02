const express = require('express');

module.exports = (app) =>{

    const protectedRouter = express.Router();

    //Modularizando controle de rotas
    //rota /auth /signup
    //rota /auth /signin 
    //app.routes.auth é o caminho do pacote onde estão as rotas
    app.use('/auth', app.routes.auth);

    protectedRouter.use('/users', app.routes.user);
    protectedRouter.use('/accounts', app.routes.accounts);
    protectedRouter.use('/transactions', app.routes.transactions);
    protectedRouter.use('/transfers', app.routes.transfers);
    protectedRouter.use('/balance', app.routes.balance);

    //Protegendo rotas /user e /account com passport
    app.use('/v1', app.config.passport.authenticate(), protectedRouter);


} 