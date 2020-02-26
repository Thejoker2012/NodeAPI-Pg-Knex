const request = require('supertest');

const jwt = require('jwt-simple');

const app = require('../../src/app.js');

const email = `${Date.now()}@email.com`

let user;

beforeAll(async ()=>{
    const res = await app.services.user.save({ name:'User Account', email, password:'12345' })
    user = { ...res[0] };
    user.token = jwt.encode(user, 'Segredo!')
});

test('Deve listar todos os usuários', ()=>{
    return request(app).get('/users')
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Deve inserir usuário com sucesso', async ()=>{

    return request(app).post('/users')
    .send({ name: 'Angélica',email, password:'12345'})
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
        expect(res.status).toBe(201)
        expect(res.body.name).toBe('Angélica')
        expect(res.body).not.toHaveProperty('password');
    });
});

test('Não deve inserir usuário sem nome', () => {
    return request(app).post('/users')
    .send({email:'email@test.com', password:'1234'})
    .set('authorization', `bearer ${user.token}`)
    .then((res)=>{
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Nome obrigatório!');
    })
})

test('Não deve inserir usuário sem email', async () => {
    const result = await request(app).post('/users')
        .send({name:'Maria', password:'1234'})
        .set('authorization', `bearer ${user.token}`)
    expect(result.status).toBe(400);
    expect(result.body.error).toBe('Email obrigatório!');
})

test('Não deve inserir usuário sem senha', async (done) => {
    request(app).post('/users')
        .send({name:'Maria', email:'iago@email.com'})
        .set('authorization', `bearer ${user.token}`)
    .then((res)=>{
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Password obrigatório!');
        done();
    })
    .catch(error => done.fail(error));
})

test('Não deve inserir usuário com email existente', async () => {
    return request(app).post('/users')
    .send({ name: 'Angélica',email, password:'123456'})
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Já existe um usuário cadastrado com esse email!');
    });
})

test('Deve armazenar senha criptografada', async () => {
    const res = await request(app).post('/users')
    .send({ name: 'Angélica',email:`${Date.now()}@email.com`, password:'123456'})
    .set('authorization', `bearer ${user.token}`)
    expect(res.status).toBe(201);

    const {id} = res.body
    const userDB = await app.services.user.findOne({id})
    expect(userDB.password).not.toBeUndefined();
    expect(userDB.password).not.toBe('123456');
})