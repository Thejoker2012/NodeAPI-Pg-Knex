const express = require('express');

module.exports = (app) => {
    const router = express.Router();

    router.get('/', (req, res, next)=>{
        app.services.transactions.findOne(req.user.id)
        .then(result => res.status(200).json(result))
        .catch(err => next(err));
    })

    router.post('/', (req, res, next)=>{
        app.services.transactions.save(req.body)
        .then(result => res.status(201).json(result[0]))
        .catch(err => next(err));
    })


    return router;
}