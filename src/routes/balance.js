const express = require('express');
const RecursoIndevidoError = require('../errors/RecursoIndevidoError.js');

module.exports = (app) => {
    const router = express.Router();

    //req.user.id diz qual o usuário que esta fazendo a requisição
    router.get('/', (req, res, next) => {
        app.services.balance.getSaldo(req.user.id)
        .then(result => res.status(200).json(result))
        .catch(err => next(err))
    });

    return router;
}