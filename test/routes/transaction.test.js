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
            expect(res.body.ammount).toBe('250.00');
    });
});

test('Transações de entrada devem ser positivas', ()=>{
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New Trans', date: new Date(), ammount: -250, type:'I', acc_id: accUser.id })
        .then((res)=>{
            expect(res.status).toBe(201);
            expect(res.body.acc_id).toBe(accUser.id);
            expect(res.body.ammount).toBe('250.00');
    });
});

test('Transações de saida devem ser negativas', ()=>{
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New Trans', date: new Date(), ammount: 250, type:'O', acc_id: accUser.id })
        .then((res)=>{
            expect(res.status).toBe(201);
            expect(res.body.acc_id).toBe(accUser.id);
            expect(res.body.ammount).toBe('-250.00');
    });
});

test('Não deve inserir uma transação sem descrição', ()=>{
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({ date: new Date(), ammount: 250, type:'O', acc_id: accUser.id })
        .then((res)=>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Descrição é um atributo obrigatório!');
    });
});

test('Não deve inserir uma transação sem valor', ()=>{
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New Trans', date: new Date(), type:'O', acc_id: accUser.id })
        .then((res)=>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Valor é um atributo obrigatório!');
    });
});

test('Não deve inserir uma transação sem data', ()=>{
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New Trans', ammount: 250, type:'O', acc_id: accUser.id })
        .then((res)=>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Data é um atributo obrigatório!');
    });
});

test('Não deve inserir uma transação sem conta', ()=>{
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${user.token}`)
        .send({description: 'New Trans', date: new Date(), ammount: 250, type:'O' })
        .then((res)=>{
            expect(res.status).toBe(400);
            expect(res.body.error).toBe('Conta é um atributo obrigatório!');
    });
});

test('Não deve inserir uma transação sem tipo', ()=>{
    return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({description: 'New Trans', date: new Date(), ammount: 250, acc_id: accUser.id })
    .then((res)=>{
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Tipo é um atributo obrigatório!');
    });
});

test('Não deve inserir uma transação com tipo inválido', ()=>{
    return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({description: 'New Trans', date: new Date(), ammount: 250, type:'S', acc_id: accUser.id })
    .then((res)=>{
        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Tipo escolhido é inválido!');
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

test('Deve alterar uma transação', ()=>{

    return app.db('transactions').insert(
        {description: 'Trans Alterar', date: new Date(), ammount: 350, type:'I', acc_id: accUser.id },['id']
    ).then(trans => request(app).put(`${MAIN_ROUTE}/${trans[0].id}`)
        .set('authorization', `bearer ${user.token}`)
        .send({ description:'Trans Updated' })
        .then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.description).toBe('Trans Updated');
    }));
    
});

test('Deve remover uma transação', ()=>{

    return app.db('transactions').insert(
        {description: 'Trans ID', date: new Date(), ammount: 350, type:'I', acc_id: accUser.id },['id']
    ).then(trans => request(app).delete(`${MAIN_ROUTE}/${trans[0].id}`)
        .set('authorization', `bearer ${user.token}`)
        .then((res)=>{
        expect(res.status).toBe(204);
    }));
    
});

test('Não deve remover uma transação de outro usuário', () => {
    return app.db('transactions').insert(
      { description: 'To delete', date: new Date(), ammount: 100, type: 'I', acc_id: accUser2.id }, ['id'],
    ).then(trans => request(app).delete(`${MAIN_ROUTE}/${trans[0].id}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(403);
        expect(res.body.error).toBe('Esse recurso não pertence ao usuário!');
      }));
  });

