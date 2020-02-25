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

test('Deve criar um usuário via signup', () => {

    return request(app).post('/auth/signup')
    .send({name:'Iago',email:`${Date.now()}@email.com`, password:'123456'})
    .then((res)=>{
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Iago');
        expect(res.body).toHaveProperty('email')
        expect(res.body).not.toHaveProperty('password')

    })
});

test('Não deve autenticar usuário com senha errada', () => {

    const email =`${Date.now()}@email.com`
    // const name ='Iago Santos'
    // const password = '12345'

    return app.services.user.save({name:'Iago santos', email, password:'12345'})
    .then(() => request(app).post('/auth/signin')
    .send({email, password:'54321'}))
    .then((res)=>{
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Usuário ou senha inválido!');
    });
    
});

test('Não deve autenticar com nome de usuário errado', () => {

    return request(app).post('/auth/signin')
    .send({email:'não@hot.com', password:'54321'})
    .then((res)=>{
        expect(res.status).toBe(400)
        expect(res.body.error).toBe('Usuário ou senha inválido!');
    });
    
});

test('Não deve acessar uma rota protegida sem token', () => {

    return request(app).get('/users')
    .then((res)=>{
        expect(res.status).toBe(401);
    })
    
});