module.exports = (app) =>{

    app.route('/auth/signin')
    .post(app.routes.auth.signin)

    app.route('/users')
    .all(app.config.passport.authenticate())
    .get(app.routes.user.findAll)
    .post(app.routes.user.create)

    app.route('/accounts')
    .all(app.config.passport.authenticate())
    .post(app.routes.accounts.create)
    .get(app.routes.accounts.findAll)

    app.route('/accounts/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.accounts.findOne)
    .put(app.routes.accounts.update)
    .delete(app.routes.accounts.remove)
    

}
