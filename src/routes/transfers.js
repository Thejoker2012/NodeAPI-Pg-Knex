const express = require('express')
const RecursoIndevidoError = require('../errors/RecursoIndevidoError.js')

module.exports = (app) =>{
    const router = express.Router();

    router.param('id',(req, res, next)=>{
        app.services.transfers.findOne({id: req.params.id })
        .then((result) => {
            if (result.user_id != req.user.id) throw new RecursoIndevidoError()
            next()
        }).catch(err => next(err))


    })

    const validate = (req, res, next) =>{
        app.services.transfers.validate({...req.body, user_id: req.user.id})
        .then(()=>next())
        .catch(err => next(err))
    }

    router.get('/',(req, res, next)=>{
        app.services.transfers.find({user_id: req.user.id})
        .then(result=> res.status(200).json(result))
        .catch(err => next(err));
    })

    //Ao tentar fazer o save vai cair no midleware de validate
    //Se passar ele executa
    //Se não o midleware lança uma exceção
    router.post('/', validate, (req, res, next) => {
        const transfer = {...req.body, user_id: req.user.id};
        app.services.transfers.save(transfer)
        .then(result => res.status(201).json(result[0]))
        .catch(err => next(err));
    })

    router.get('/:id', (req, res, next)=>{
        app.services.transfers.findOne({id: req.params.id })
        .then(result => res.status(200).json(result))
        .catch(err => next(err));
    })

    //Ao tentar fazer o update vai cair no midleware de validate
    //Se passar ele executa
    //Se não o midleware lança uma exceção
    router.put('/:id', validate, (req, res, next) => {
        app.services.transfers.update(req.params.id, {...req.body, user_id: req.user.id})
        .then(result => res.status(200).json(result[0]))
        .catch(err => next(err))
    });

    router.delete('/:id', (req, res, next) => {
        app.services.transfers.remove(req.params.id)
        .then(()=>res.status(204).send())
        .catch(err => next(err))
    });

    return router;
}