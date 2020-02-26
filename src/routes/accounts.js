const express = require('express');

module.exports = (app) =>{

    const router = express.Router();

    //Rota criar uma account
    router.post('/', (req, res, next) => {
        app.services.accounts.save({...req.body, user_id: req.user.id})
        .then((result) => {
            return res.status(201).json(result[0]);
        })
        .catch(err => next(err))
 
    })

    //Rota para buscar todas as accounts
    router.get('/',  (req, res, next) => {
        app.services.accounts.findAll(req.user.id)
            .then(result => res.status(200).json(result))
            .catch(err => next(err))

    });

    //Rota para buscar uma account
    router.get('/:id', (req, res, next) => {
        app.services.accounts.findOne({id: req.params.id})
            .then(result => res.status(200).json(result))
            .catch(err => next(err))

    });
    
    //Rota para atualizar uma account
    router.put('/:id', (req, res, next) => {
        app.services.accounts.update(req.params.id, req.body)
            .then(result => res.status(200).json(result[0]))
            .catch(err => next(err))

    });

    //Rota para deletar uma account
    router.delete('/:id', (req, res, next) => {
        app.services.accounts.remove(req.params.id)
            .then(() => res.status(204).send())
            .catch(err => next(err))
            
    });

    return router;

}