const request = require('supertest');
const app = require('../../src/app');

test('Deve receber token ao logar', () => {

    const email =`${Date.now()}@email.com`
    // const name ='Iago Santos'
    // const password = '12345'

    return app.services.user.save({name:'Iago santos', email, password:'12345'})
    .then(() => request(app).post('/auth/signin')
    .send({email, password:'12345'}))
    .then((res)=>{
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token');
    });
    
});