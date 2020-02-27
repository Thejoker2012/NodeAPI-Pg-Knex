const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app.js');

const MAIN_ROUTE = '/v1/accounts';
let user;
let user2;

beforeEach(async ()=>{
    const res = await app.services.user.save({ name:'User Account', email:`${Date.now()}@eemail.com`, password:'12345' })
    user = { ...res[0] };

    user.token = jwt.encode(user, 'Segredo!')

    const res2 = await app.services.user.save({ name:'User Account #2', email:`${Date.now()}@eemail.com`, password:'12345' })
    user2 = { ...res2[0] };
});

test('Deve inserir uma conta com sucesso', ()=>{
    return request(app).post(MAIN_ROUTE)
    .send({name:'Acc#1'})
    .set('authorization', `bearer ${user.token}`)
    .then((result) => {
        expect(result.status).toBe(201);
        expect(result.body.name).toBe('Acc#1')
    });
});


test('Deve retornar uma account por Id', ()=>{
    return app.db('accounts')
        .insert({name:'Acc List por Id', user_id: user.id},['id'])
        .then( acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`))
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
        .send({name: 'Acc Updated'})
        .set('authorization', `bearer ${user.token}`))
        .then((res)=>{
            expect(res.status).toBe(200)
            expect(res.body.name).toBe('Acc Updated');
        })
        
});

test('Deve remover uma account', ()=>{
    return app.db('accounts')
        .insert({name:'Acc to remove', user_id: user.id},['id'])
        .then( acc => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
        .set('authorization', `bearer ${user.token}`))
        .then((res)=>{
            expect(res.status).toBe(204);
    })
        
});

//Validação de campos
test('Não deve inserir uma account sem nome', () => {
    return request(app).post(MAIN_ROUTE)
    .send({})
    .set('authorization', `bearer ${user.token}`)
    .then((result) => {
        expect(result.status).toBe(400);
        expect(result.body.error).toBe('Account name obrigatório!')
    });
})

test('Deve listar apenas as contas do usuário', () => {

    return app.db('accounts').insert([
        {name:'Acc User 1#',user_id:user.id},
        {name:'Acc User 2#',user_id:user2.id}
    ])
    .then(()=> request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res)=>{
        expect(res.status).toBe(200)
        expect(res.body.length).toBe(1)
        expect(res.body[0].name).toBe('Acc User 1#')
    }));
    
});

test('Não deve inserir uma account de nome duplicado, para o mesmo usuário', () => {

    return app.db('accounts').insert({name: 'Acc duplicada', user_id:user.id})
    .then(()=> request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({name: 'Acc duplicada'}))
    .then((res)=>{
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Já existe uma conta com esse nome!')
    })

})

test('Não deve retornar uma conta de outro usuário', () => {

    return app.db('accounts')
    .insert({name:'Acc User 2#', user_id: user2.id},['id'])
    .then(acc => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`)
    .set('authorization', `bearer ${user.token}`))
    .then((res)=>{
        expect(res.status).toBe(403)
        expect(res.body.error).toBe('Esse recurso não pertence ao usuário!')
    })
})

test.skip('Não deve alterar uma conta de outro usuário', () => {})

test.skip('Não deve remover uma conta de outro usuário', () => {})
