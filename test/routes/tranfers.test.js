const request = require('supertest')
const app = require('../../src/app.js')

const MAIN_ROUTE = '/v1/transfers';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAsIm5hbWUiOiJVc2VyIDEjIiwiZW1haWwiOiJ1c2VyMUBlbWFpbC5jb20ifQ.qcQGE2RnVr9Nbx5tOhe2ABZFPkqyJWsZGwCoIN3LsEw'

//Função para apagar, criar e popular o banco de dados
beforeAll(async ()=>{
    //Desfazer o banco de dados
    //await app.db.migrate.rollback();
    //Criar o banco de dados
    //await app.db.migrate.latest();
    //Popular o banco de dados
    await app.db.seed.run();
})

test('Deve listar apenas as tranferencias do usuário', ()=>{
    
    return request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${TOKEN}`)
        .then((res)=>{
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].description).toBe('Tranfer #1');
    });

});

test('Deve inserir uma tranferencia com sucesso', ()=>{
    return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${TOKEN}`)
        .send({description:'Regular Transfers', user_id: 10000, acc_ori_id:10000, acc_dest_id:10001, ammount:100, date:new Date()})
        .then(async (res)=>{
            //console.log(res.body)
            expect(res.status).toBe(201);
            expect(res.body.description).toBe('Regular Transfers');
            
            const transactions = await app.db('transactions').where({transfer_id: res.body.id})
            expect(transactions).toHaveLength(2);
            expect(transactions[0].description).toBe('Transfer to acc #10001');
            expect(transactions[1].description).toBe('Transfer from acc #10000');
            expect(transactions[0].ammount).toBe('-100.00');
            expect(transactions[1].ammount).toBe('100.00');
            expect(transactions[0].acc_id).toBe(10000);
            expect(transactions[1].acc_id).toBe(10001);





        });
});