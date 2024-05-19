const request = require('supertest');
const mongoose = require('mongoose');
const incomeSchema = require('../../src/models/incomes.model');
const financeSchema = require('../../src/models/finance.model');
const budgetSchema = require('../../src/models/budget.model');
const mongoDbMemory = require('../../configs/dbMemo')

const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tYXIiLCJpYXQiOjE3MTU5NzA0ODEsImV4cCI6MTcyNjc5NzA0ODF9.f1Av4amrPrz9Uh0-ytsW9DVICULWWUKUseE9egscl0I';
const invalidToken = '12354';

let server = require('../../src/app');

describe('incomes route', () => {

    beforeAll(async () => {
        await mongoDbMemory.connect()
    })

    beforeEach(async () => {
        // the token contains omar as username
        server = require('../../src/app');
        await budgetSchema.create({ username: 'omar', montant: 0 });
        await financeSchema.create({ username: 'omar', totalExpense: 0, totalIncome: 0, solde: 0, budget: 0 });
    });

    afterEach(async () => {
        await incomeSchema.deleteMany();
        await budgetSchema.deleteMany();
        await financeSchema.deleteMany();
        await server.close();
    });


    afterAll(async () => {
        await mongoDbMemory.disconnect()
        await server.close();
    })

    // ------------GET------------
    describe('GET /api/incomes ', () => {
        it('should return incomes with status 200', async () => {
            // we post income data before getting them
            await request(server).post('/api/income')
                .send({
                    title: 'Test Income',
                    montant: 100,
                })
                .set('Authorization', `Bearer ${validToken}`);

            const getResponse = await request(server)
                .get('/api/incomes')
                .set('Authorization', `Bearer ${validToken}`);

            expect(getResponse.status).toBe(200);
            expect(getResponse.body.data).toEqual([
                {
                    title: 'Test Income',
                    montant: 100,
                    _id: expect.anything(),
                    createdAt: expect.anything(),
                }
            ]);
        });

        it('should return 401 for invalid token', async () => {
            await request(server).post('/api/income')
                .send({
                    title: 'Test Income',
                    montant: 100,
                })
                .set('Authorization', `Bearer ${invalidToken}`);

            const getResponse = await request(server)
                .get('/api/incomes')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(getResponse.status).toBe(401);
            expect(getResponse.body.message).toEqual('jwt malformed');
            expect(getResponse.body.data).toEqual({});
        });
    });

    describe('GET /api/incomes with filters', () => {
        it('should return filtered incomes by montant', async () => {
            await incomeSchema.create([
                { title: 'Income 1', montant: 50, username: 'omar' },
                { title: 'Income 2', montant: 150, username: 'omar' },
                { title: 'Income 3', montant: 250, username: 'omar' }
            ]);

            const response = await request(server)
                .get('/api/incomes?gt=100')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(2);
            expect(response.body.data[0].montant).toBeGreaterThan(100);
            expect(response.body.data[1].montant).toBeGreaterThan(100);
        });
    });

    describe('GET /api/incomes with pagination', () => {
        it('should return paginated incomes', async () => {
            await incomeSchema.create([
                { title: 'Income 1', montant: 50, username: 'omar' },
                { title: 'Income 2', montant: 150, username: 'omar' },
                { title: 'Income 3', montant: 250, username: 'omar' },
                { title: 'Income 4', montant: 350, username: 'omar' }
            ]);

            const response = await request(server)
                .get('/api/incomes?limit=2&page=2')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(2);
            expect(response.body.data[1].montant).toEqual(350);
        });
    });

    describe('GET /api/incomes with pagination and filter', () => {
        it('should ignore pagination and limit when filter exists (gt=150)', async () => {
            await incomeSchema.create([
                { title: 'Income 1', montant: 50, username: 'omar' },
                { title: 'Income 2', montant: 150, username: 'omar' },
                { title: 'Income 3', montant: 200, username: 'omar' },
                { title: 'Income 4', montant: 250, username: 'omar' },
                { title: 'Income 5', montant: 300, username: 'omar' },
                { title: 'Income 6', montant: 350, username: 'omar' }
            ]);

            const response = await request(server)
                .get('/api/incomes?limit=2&page=2&gt=150')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.data.length).toBe(4);
            expect(response.body.data[2].montant).toEqual(300);
        });
    });

    // ------------POST------------
    describe('POST /api/income', () => {
        it('should create an income with valid data and update finance', async () => {

            // Set initial budget
            await request(server)
                .post('/api/budget')
                .send({
                    montant: 1000,
                })
                .set('Authorization', `Bearer ${validToken}`);

            // add income before adding new one
            await request(server)
                .post('/api/income')
                .send({
                    title: 'Income',
                    montant: 150,
                })
                .set('Authorization', `Bearer ${validToken}`);

            // finance state before adding new income
            const getFinanceResponse = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${validToken}`);

            expect(getFinanceResponse.body.data[0]).toEqual({
                budget: 1000,
                totalExpense: 0,
                totalIncome: 150,
                solde: 1150,
                createdAt: expect.anything(),
                __v: 0
            });

            // add new income
            const postIncomeResponse = await request(server)
                .post('/api/income')
                .send({
                    title: 'new Income',
                    montant: 50,
                })
                .set('Authorization', `Bearer ${validToken}`);

            expect(postIncomeResponse.status).toBe(201);
            expect(postIncomeResponse.body.message).toEqual('income created and finance updated');

            // finance state after one income is added
            const getFinanceResponseAfterIncomeAdded = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${validToken}`);

            expect(getFinanceResponseAfterIncomeAdded.status).toBe(200);
            expect(getFinanceResponseAfterIncomeAdded.body.data[0]).toEqual({
                budget: 1000,
                totalExpense: 0,
                totalIncome: 200, // 150 + 50
                solde: 1200, // 1000 + 200
                createdAt: expect.anything(),
                __v: 0
            });
        });

        it('should return 400 if title is missing', async () => {
            const response = await request(server)
                .post('/api/income')
                .send({
                    montant: 150,
                })
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('`title` is required');
        });

        it('should return 400 if montant is missing', async () => {
            const response = await request(server)
                .post('/api/income')
                .send({
                    title: 'New Income',
                })
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toContain('`montant` is required');
        });
    });

    // ------------DELETE---------------
    describe('DELETE /api/income/:id', () => {
        it('should delete an income by id and update finance', async () => {

            // Set initial budget
            await request(server)
                .post('/api/budget')
                .send({
                    montant: 1000,
                })
                .set('Authorization', `Bearer ${validToken}`);

            // put some data to incomes before delete one
            await request(server)
                .post(`/api/income`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    title: 'Income1 to delete',
                    montant: 60,
                });

            await request(server)
                .post(`/api/income`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    title: 'Income2 to delete',
                    montant: 40,
                });

            // finance state before delete income 
            const getFinanceResponse = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${validToken}`);

            expect(getFinanceResponse.status).toBe(200);
            expect(getFinanceResponse.body.data[0]).toEqual({
                budget: 1000,
                totalExpense: 0,
                totalIncome: 100, // 60 + 40
                solde: 1100, // 1000 + 100
                createdAt: expect.anything(),
                __v: 0
            });

            // get incomes data to get id for deleting one after
            const getIncomesResponse = await request(server)
                .get('/api/incomes')
                .set('Authorization', `Bearer ${validToken}`);
            const incomeId = getIncomesResponse.body.data[0]._id; // the income id to delete

            // deleting one income 
            const deleteIncomeResponse = await request(server)
                .delete(`/api/incomes/${incomeId}`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(deleteIncomeResponse.status).toBe(200);
            expect(deleteIncomeResponse.body.message).toEqual(`income for id ${incomeId} deleted and finance updated`);
            const deletedIncome = await incomeSchema.findById(incomeId);
            expect(deletedIncome).toBeNull();

            // finance state after one income is deleted
            const getFinanceResponseAfterIncomeDeleted = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${validToken}`);

            expect(getFinanceResponseAfterIncomeDeleted.status).toBe(200);
            expect(getFinanceResponseAfterIncomeDeleted.body.data[0]).toEqual({
                budget: 1000,
                totalExpense: 0,
                totalIncome: 100, // 60 + 40
                solde: 1100, // 1000 + (100 - 0)
                createdAt: expect.anything(),
                __v: 0
            });
        });

        it('should return 400 if id missing', async () => {
            const income = await incomeSchema.create({
                title: 'Income to delete',
                montant: 50,
                username: 'omar'
            });

            const response = await request(server)
                .delete(`/api/incomes/10`)
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(`id unknown 10`);
        });
    });

});
