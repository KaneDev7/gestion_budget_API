const request = require('supertest');
const mongoose = require('mongoose');
const financeSchema = require('../../src/models/finance.model');
const mongoDbMemory = require('../../configs/dbMemo');
let server = require('../../src/app');
const { TEST_VALID_TOKEN, TEST_VALID_USERNAME } = require('../../src/constants/constants');
const invalidToken = '12354';

describe('finance route', () => {
    beforeAll(async () => {
        await mongoDbMemory.connect();
    });

    beforeEach(async () => {
        await financeSchema.create({ username: TEST_VALID_USERNAME, totalExpense: 200, totalIncome: 500, solde: 300, budget: 1000 });
    });

    afterEach(async () => {
        await financeSchema.deleteMany();
    });

    afterAll(async () => {
        await mongoDbMemory.disconnect();
    });

    // ------------GET------------
    describe('GET /api/finances', () => {
        it('should return finance data for the authenticated user', async () => {
            const response = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

            expect(response.status).toBe(200);
            expect(response.body.data[0]).toEqual({
                totalExpense: 200,
                totalIncome: 500,
                solde: 300,
                budget: 1000,
                createdAt: expect.anything(),
                __v: 0
            });
        });

        it('should return 401 for invalid token', async () => {
            const response = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(response.status).toBe(401);
            expect(response.body.message).toEqual('jwt malformed');
        });

        it('should handle server errors gracefully', async () => {
            jest.spyOn(financeSchema, 'find').mockImplementation(() => {
                throw new Error('Database query failed');
            });

            const response = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toContain('Something went wrong: Database query failed');

            financeSchema.find.mockRestore();
        });
    });
});
