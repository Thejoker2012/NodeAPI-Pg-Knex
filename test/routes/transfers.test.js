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

describe('Ao salvar uma transferência válida...', ()=>{
    let transferId;
    let income;
    let outcome;
    
    test('Deve retornar o status 201 e os dados da tranferência', ()=>{
        return request(app).post(MAIN_ROUTE)
        .set('authorization', `bearer ${TOKEN}`)
        .send({description:'Regular Transfers', user_id: 10000, acc_ori_id:10000, acc_dest_id:10001, ammount:100, date:new Date()})
        .then(async (res)=>{
            console.log(res.body)
            expect(res.status).toBe(201);
            expect(res.body.description).toBe('Regular Transfers');
            transferId = res.body.id;
        });
    });

    test('As transações equivalentes devem ter sido geradas', async ()=>{
        const transactions = await app.db('transactions').where({transfer_id: transferId}).orderBy('ammount')
        expect(transactions).toHaveLength(2);
        [outcome, income] = transactions;
    });

    test('A transação de saida deve ser negativa', ()=>{
        expect(outcome.description).toBe('Transfer to acc #10001');
        expect(outcome.ammount).toBe('-100.00');
        expect(outcome.acc_id).toBe(10000);
        expect(outcome.type).toBe('O');
    });

    test('A transação de entrada deve ser positiva', ()=>{
        expect(income.description).toBe('Transfer from acc #10000');
        expect(income.ammount).toBe('100.00');
        expect(income.acc_id).toBe(10001);
        expect(income.type).toBe('I');

    });

    test('Ambas devem referenciar a tranferencia que as originou', ()=>{
        expect(income.transfer_id).toBe(transferId);
        expect(outcome.transfer_id).toBe(transferId);
    });
})

describe('Ao tentar salvar uma tranferência inválida...',()=>{

    const validTransfer = {description:'Regular Transfers', user_id: 10000, acc_ori_id:10000, acc_dest_id:10001, ammount:100, date:new Date()}

    const template = (newData, errorMessage) => {
        return request(app).post(MAIN_ROUTE)
            .set('authorization', `bearer ${TOKEN}`)
            .send({...validTransfer, ...newData})
            .then((res)=>{
                expect(res.status).toBe(400)
                expect(res.body.error).toBe(errorMessage)
        });
    }

    test('Não deve inserir sem descrição', ()=>template({description:null},'Descrição é um atributo obrigatório!'));
    test('Não deve inserir sem valor', ()=>template({ammount:null},'Valor é um atributo obrigatório!'));
    test('Não deve inserir sem data', ()=>template({date:null},'Data é um atributo obrigatório!'));
    test('Não deve inserir sem conta de origem', ()=>template({acc_ori_id:null},'Conta de origem é um atributo obrigatório!'));
    test('Não deve inserir sem conta de destino', ()=>template({acc_dest_id:null},'Conta de destino é um atributo obrigatório!'));
    test('Não deve inserir se a conta de origem e destino forem a mesma', ()=>template({acc_dest_id:10000},'Não é possível inserir para a mesma conta!'));
    test('Não deve inserir se as contas pertencerem a outro usuário', ()=>template({acc_ori_id:10002},'Conta #10002! não pertence ao usuário!'));
    
})

test('Deve retornar uma tranferencia por id', ()=>{
    return request(app).get(`${MAIN_ROUTE}/10000`)
        .set('authorization', `bearer ${TOKEN}`)
        .then((res)=>{
            expect(res.status).toBe(200);
            expect(res.body.description).toBe('Tranfer #1');
        
    });
});

describe('Ao alterar uma transferência válida...', ()=>{
    let transferId;
    let income;
    let outcome;
    
    test('Deve retornar o status 200 e os dados da tranferência', ()=>{
        return request(app).put(`${MAIN_ROUTE}/10000`)
        .set('authorization', `bearer ${TOKEN}`)
        .send({description:'Transfers Updated', user_id: 10000, acc_ori_id:10000, acc_dest_id:10001, ammount:500, date:new Date()})
        .then(async (res)=>{ 
            console.log(res)
            expect(res.status).toBe(200);
            expect(res.body.description).toBe('Transfers Updated');
            expect(res.body.ammount).toBe('500.00')
            transferId = res.body.id;
        });
    });

    test('As transações equivalentes devem ter sido geradas', async ()=>{
        const transactions = await app.db('transactions').where({transfer_id: transferId}).orderBy('ammount')
        expect(transactions).toHaveLength(2);
        [outcome, income] = transactions;
    });

    test('A transação de saida deve ser negativa', ()=>{
        expect(outcome.description).toBe('Transfer to acc #10001');
        expect(outcome.ammount).toBe('-500.00');
        expect(outcome.acc_id).toBe(10000);
        expect(outcome.type).toBe('O');
    });

    test('A transação de entrada deve ser positiva', ()=>{
        expect(income.description).toBe('Transfer from acc #10000');
        expect(income.ammount).toBe('500.00');
        expect(income.acc_id).toBe(10001);
        expect(income.type).toBe('I');

    });

    test('Ambas devem referenciar a tranferencia que as originou', ()=>{
        expect(income.transfer_id).toBe(transferId);
        expect(outcome.transfer_id).toBe(transferId);
    });
})

describe('Ao tentar alterar uma tranferência inválida...',()=>{

    const validTransfer = {description:'Regular Transfers', user_id: 10000, acc_ori_id:10000, acc_dest_id:10001, ammount:100, date:new Date()}

    const template = (newData, errorMessage) => {
        return request(app).put(`${MAIN_ROUTE}/10000`)
            .set('authorization', `bearer ${TOKEN}`)
            .send({...validTransfer, ...newData})
            .then((res)=>{
                expect(res.status).toBe(400)
                expect(res.body.error).toBe(errorMessage)
        });
    }

    test('Não deve alterar sem descrição', ()=>template({description:null},'Descrição é um atributo obrigatório!'));
    test('Não deve alterar sem valor', ()=>template({ammount:null},'Valor é um atributo obrigatório!'));
    test('Não deve alterar sem data', ()=>template({date:null},'Data é um atributo obrigatório!'));
    test('Não deve alterar sem conta de origem', ()=>template({acc_ori_id:null},'Conta de origem é um atributo obrigatório!'));
    test('Não deve alterar sem conta de destino', ()=>template({acc_dest_id:null},'Conta de destino é um atributo obrigatório!'));
    test('Não deve alterar se a conta de origem e destino forem a mesma', ()=>template({acc_dest_id:10000},'Não é possível inserir para a mesma conta!'));
    test('Não deve alterar se as contas pertencerem a outro usuário', ()=>template({acc_ori_id:10002},'Conta #10002! não pertence ao usuário!'));
    
})

describe('Ao remover uma tranferência...', () => {

    test('Deve retornar status 204', ()=>{
        return request(app).delete(`${MAIN_ROUTE}/10000`)
            .set('authorization', `bearer ${TOKEN}`)
            .then((res)=>{
                expect(res.status).toBe(204);
            
        });
    });

    test('O registro deve ser apagado do banco', ()=>{
        return app.db('transfers').where({id:10000})
        .then((result)=>{
            expect(result).toHaveLength(0)
        })
            
    });
    

    test('As transações associadas devem ter sido removidas', ()=>{
        return app.db('transactions').where({transfer_id:10000})
        .then((result)=>{
            expect(result).toHaveLength(0)
        })
    });

})