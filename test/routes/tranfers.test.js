const request = require('supertest')
const app = require('../../src/app.js')

const MAIN_ROUTE = '/v1/transfers';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAsIm5hbWUiOiJVc2VyIDEjIiwiZW1haWwiOiJ1c2VyMUBlbWFpbC5jb20ifQ.qcQGE2RnVr9Nbx5tOhe2ABZFPkqyJWsZGwCoIN3LsEw'

test('Deve listar apenas as tranferencias do usuário', ()=>{
    
    return request(app).get(MAIN_ROUTE)
        .set('authorization', `bearer ${TOKEN}`)
        .then((res)=>{
        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].description).toBe('Tranfer #1');
    });

});