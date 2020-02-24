module.exports = (app) =>{

    app.route('/users')
    .get(app.routes.user.findAll)
    .post(app.routes.user.create)

    app.route('/accounts')
    .post(app.routes.accounts.create)

}
