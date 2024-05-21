const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userSchema = require('../../src/models/users.model');
const tokenSchema = require('../../src/models/token.model');
const mongoDbMemory = require('../../configs/dbMemo');
const server = require('../../src/app');
const { TEST_VALID_TOKEN, TEST_VALID_USERNAME } = require('../../src/constants/constants');
const invalidToken = '12354';

describe('Token management', () => {
    beforeAll(async () => {
        await mongoDbMemory.connect();
    });

    afterAll(async () => {
        await mongoDbMemory.disconnect();
    });

    beforeEach(async () => {
        await userSchema.create({ username: TEST_VALID_USERNAME, password: 'hashed_password', token: TEST_VALID_TOKEN });
    });

    afterEach(async () => {
        await userSchema.deleteMany();
        await tokenSchema.deleteMany();
        jest.clearAllMocks();
    });


    describe('GET /api/token/new', () => {

        it('should generate a new token successfully', async () => {
            const response = await request(server)
                .get('/api/token/new')
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`)

            expect(response.status).toBe(200);
            expect(response.body.message).toEqual('New token is generated');
            expect(response.body.data).toHaveProperty('token');

            const updatedUser = await userSchema.findOne({ username: TEST_VALID_USERNAME });
            expect(updatedUser.token).toEqual(response.body.data.token);

            const tokenInCookies = response.headers['set-cookie'][0];
            expect(tokenInCookies).toContain('jwt=');
        });

        it('should return 401 if token is invalid', async () => {
            const response = await request(server)
                .get('/api/token/new')
                .set('Authorization', `Bearer ${invalidToken}`)

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('jwt malformed');
        });

        it('should handle errors gracefully', async () => {
            jest.spyOn(jwt, 'sign').mockImplementation(() => {
                throw new Error('JWT error');
            });

            const response = await request(server)
                .get('/api/token')
                .set('Authorization', `Bearer ${invalidToken}`)

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('jwt malformed');
        });
    });

    describe('GET /api/token', () => {
        it('should get the current token successfully', async () => {
            const response = await request(server)
                .get('/api/token')
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`)

            expect(response.status).toBe(201);
            expect(response.body.data).toHaveProperty('token', TEST_VALID_TOKEN);
        });


        it('should return 401 if token is invalid', async () => {
            const response = await request(server)
                .get('/api/token')
                .set('Authorization', `Bearer ${invalidToken}`)

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('jwt malformed');

        });

        it('should handle errors gracefully', async () => {
            jest.spyOn(userSchema, 'findOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(server)
                .get('/api/token')
                .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`)

            expect(response.status).toBe(500);
            expect(response.body.message).toContain('Something went wrong: Database error');
        });
    });
});
