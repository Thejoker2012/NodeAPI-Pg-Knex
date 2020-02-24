const request = require('supertest');
const app = require('../../src/app.js');

const MAIN_ROUTE = '/accounts';
const email = `${Date.now()}@email.com`
let user;

beforeAll(async ()=>{
    const res = await app.services.user.save({ name:'User Account', email, password:'12345' })
    user = { ...res[0] };
});

test('Deve inserir uma conta com sucesso', ()=>{
    return request(app).post(MAIN_ROUTE)
    .send({name:'Acc#1', user_id: user.id})
    .then((result) => {
        expect(result.status).toBe(201);
        expect(result.body.name).toBe('Acc#1')
    });
});

test('Deve listar todos as accounts', ()=>{
    return app.db('accounts')
        .insert({name:'AccList', user_id: user.id})
        .then(() => request(app).get(MAIN_ROUTE))
        .then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
    })
});

test('Deve retornar uma account por Id', ()=>{
    return app.db('accounts')
        .insert({name:'Acc List por Id', user_id: user.id},['id'])
        .then( acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`))
        .then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('Acc List por Id');
            expect(res.body.user_id).toBe(user.id);
        });
});

test('Deve alterar uma account', ()=>{
    return app.db('accounts')
        .insert({name:'Acc Update', user_id: user.id},['id'])
        .then( acc => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
        .send({name: 'Acc Updated'}))
        .then((res)=>{
            expect(res.status).toBe(200)
            expect(res.body.name).toBe('Acc Updated');
        })
        
});
