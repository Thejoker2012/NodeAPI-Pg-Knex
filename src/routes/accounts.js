module.exports = (app) =>{

    const create = (req, res) => {
        app.services.accounts.save(req.body)
        .then((result) => {
            return res.status(201).json(result[0]);
        })
 
    }

    const findAll = (req, res) => {
        app.services.accounts.findAll()
            .then(result => res.status(200).json(result))
    };

    const findOne = (req, res) => {
        app.services.accounts.findOne({id: req.params.id})
            .then(result => res.status(200).json(result))
    };

    const update = (req, res) => {
        app.services.accounts.update(req.params.id, req.body)
            .then(result => res.status(200).json(result[0]))
    };

    return {
        create,
        findAll,
        findOne,
        update
    }

}