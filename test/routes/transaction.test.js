const request = require('supertest')
const jwt = require('jwt-simple')
const app = require('../../src/app.js')

const MAIN_ROUTE = '/v1/transactions';

let user;
let user2;

let accUser;
let accUser2;

beforeAll(async()=>{
    await app.db('transactions').delete()
    await app.db('accounts').delete()
    await app.db('users').delete()
    const users = await app.db('users').insert([
        {name:'User #1', email:'user@email.com',password:'$2a$10$yCeh./BKF4JQJ25o77B20e4BM6k0bGB3HGYCobMoOgoYP8CKNoPVW'},
        {name:'User #2', email:'user2@email.com',password:'$2a$10$yCeh./BKF4JQJ25o77B20e4BM6k0bGB3HGYCobMoOgoYP8CKNoPVW'},
    ],'*');//'*' retorna os usuáios inseridos
    [user2, user] = users; //inserindo os usuarios nas variáveis

    delete user.password;
    user.token = jwt.encode(user, 'Segredo!');

    const accs = await app.db('accounts').insert([
        {name:'Acc #1', user_id: user.id},
        {name:'Acc #2', user_id: user2.id},
    ], '*');
    [accUser, accUser2] = accs;
});

test('Deve listar apenas as transações do usuário ', ()=>{

    //2 usuarios, 2 contas, 2transações
    return app.db('transactions').insert([

        {description: 'Trans #1', date: new Date(), ammount: 100, type:'I', acc_id: accUser.id },
        {description: 'Trans #2', date: new Date(), ammount: 300, type:'O', acc_id: accUser2.id }
        
    ]).then(()=> request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
    .then((res)=>{
        expect(res.status).toBe(200)
        expect(res.body).toHaveLength(1)
        expect(res.body[0].description).toBe('Trans #1');
    }))
    
});

test('Deve inserir uma transação com sucesso', ()=>{
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New Trans', date: new Date(), ammount: 250, type:'I', acc_id: accUser.id })
        .then((res)=>{
            expect(res.status).toBe(201);
            expect(res.body.acc_id).toBe(accUser.id);
    });
});

test('Deve retornar uma transação por Id', ()=>{

    return app.db('transactions').insert(
        {description: 'Trans ID', date: new Date(), ammount: 350, type:'I', acc_id: accUser.id },['id']
    ).then(trans => request(app).get(`${MAIN_ROUTE}/${trans[0].id}`)
        .set('authorization', `bearer ${user.token}`)
        .then((res)=>{
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(trans[0].id);
        expect(res.body.description).toBe('Trans ID');
    }));
    
});