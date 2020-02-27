const express = require('express');

module.exports = (app) => {
    const router = express.Router();

    //Buscando uma transação
    router.get('/', (req, res, next)=>{
        app.services.transactions.find(req.user.id)
        .then(result => res.status(200).json(result))
        .catch(err => next(err));
    })

    //Inserindo uma transação
    router.post('/', (req, res, next)=>{
        app.services.transactions.save(req.body)
        .then(result => res.status(201).json(result[0]))
        .catch(err => next(err));
    })

    //Buscando uma transação por ID
    router.get('/:id', (req, res, next) => {
        app.services.transactions.findOne({id:req.params.id})
        .then(result => res.status(200).json(result))
        .catch(err => next(err));
    });

    //Atualizando transação por ID
    router.put('/:id',( req, res, next) => {
        app.services.transactions.update(req.params.id, req.body)
        .then(result =>  res.status(200).json(result[0]))
        .catch(error => next(err));
    })

    //Deletando transação por ID
    router.delete('/:id',( req, res, next) => {
        app.services.transactions.remove(req.params.id)
        .then(() =>  res.status(204).send())
        .catch(error => next(err));
    })

    return router;
}