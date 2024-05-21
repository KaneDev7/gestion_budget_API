const request = require('supertest');
const mongoose = require('mongoose');
const budgetSchema = require('../../src/models/budget.model');
const financeSchema = require('../../src/models/finance.model');
const mongoDbMemory = require('../../configs/dbMemo')
let server = require('../../src/app');

const { TEST_VALID_TOKEN, TEST_VALID_USERNAME } = require('../../src/constants/constants');
const invalidToken = '12354';

describe('budget route', () => {

    beforeAll(async () =>{
      await mongoDbMemory.connect()
    })

    beforeEach(async () => {
        await budgetSchema.create({ username: TEST_VALID_USERNAME, montant: 0 });
        await financeSchema.create({ username: TEST_VALID_USERNAME, totalExpense: 0, totalIncome: 0, solde: 0, budget: 0 });
    });

    afterEach(async () => {
        await budgetSchema.deleteMany();
        await financeSchema.deleteMany();
    });

    afterAll(async () =>{
       await mongoDbMemory.disconnect()
    })

    // ------------POST------------
    describe('POST /api/budget', () => {
        it('should create a budget with valid data and update finance', async () => {

            // post data to expenses 
            const resposnseExpensePost = await request(server)
                .post('/api/expense')
                .send({
                    title: 'test',
                    montant: 200,
                })
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

            expect(resposnseExpensePost.status).toBe(201);
            expect(resposnseExpensePost.body.message).toEqual('expense created and finance updated')

            // post data to income 
            const resposnseIncomePost = await request(server)
                .post('/api/income')
                .send({
                    title: 'test',
                    montant: 500,
                })
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

            expect(resposnseIncomePost.status).toBe(201);
            expect(resposnseIncomePost.body.message).toEqual('income created and finance updated')

            // initialize budget
            const response = await request(server)
                .post('/api/budget')
                .send({
                    montant: 1000,
                })
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

            expect(response.status).toBe(201);
            expect(response.body.message).toEqual('budget and finance updated');


            const financeResponse = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

            expect(financeResponse.body.data[0]).toEqual(
                {
                    budget: 800,
                    totalExpense: 200,
                    totalIncome: 500,
                    solde: 1100, // 800 + (500 - 200) 
                    createdAt: expect.anything(),
                    __v: 0
                }
            );
        });

        it('should return 400 if montant is missing', async () => {
            const response = await request(server)
                .post('/api/budget')
                .send({})
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain("montant can't be empty");
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(server)
                .post('/api/budget')
                .send({
                    montant: 1000,
                })
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(response.status).toBe(401);
            expect(response.body.message).toEqual('jwt malformed');

        });
    });

});
