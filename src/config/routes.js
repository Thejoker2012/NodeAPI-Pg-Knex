module.exports = (app) =>{

    app.route('/users')
    .get(app.routes.user.findAll)
    .post(app.routes.user.create)

}
