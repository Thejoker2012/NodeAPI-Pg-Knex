const request = require('supertest');

const app = require('../../src/app.js');

test('Deve listar todos os usuários', ()=>{
    return request(app).get('/users')
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Deve inserir usuário com sucesso', ()=>{

    const email = `${Date.now()}@email.com`

    return request(app).post('/users')
    .send({ name: 'Angélica',email, password:'123456'})
    .then((res) => {
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Angélica');
    });
});

test('Não deve inserir usuário sem nome', () => {
    return request(app).post('/users')
    .send({email:'email@test.com', password:'1234'})
    .then((res)=>{
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Nome obrigatório!');
    })
})
test('Não deve inserir usuário sem email', async () => {
    const result = await request(app).post('/users')
        .send({name:'Maria', password:'1234'})
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Email obrigatório!');
})