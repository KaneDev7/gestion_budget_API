const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = require('../../src/models/users.model');
const financeSchema = require('../../src/models/finance.model');
const budgetSchema = require('../../src/models/budget.model');
const mongoDbMemory = require('../../configs/dbMemo');
const server = require('../../src/app');

const validUser = { username: 'testUser', password: 'testPassword' };
const shortPasswordUser = { username: 'testUser', password: '123' };
const existingUser = { username: 'existingUser', password: 'testPassword' };

describe('User registration', () => {
    beforeAll(async () => {
        await mongoDbMemory.connect();
    });

    afterAll(async () => {
        await mongoDbMemory.disconnect();
    });

    beforeEach(async () => {
        await userSchema.deleteMany();
        await budgetSchema.deleteMany();
        await financeSchema.deleteMany();
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/register', () => {
        it('should create a new user and initialize budget and finance data', async () => {
            const response = await request(server)
                .post('/api/auth')
                .send(validUser);

            expect(response.status).toBe(201);
            expect(response.body.message).toEqual('user created');

            const user = await userSchema.findOne({ username: validUser.username });
            expect(user).not.toBeNull();
            const passwordMatch = await bcrypt.compare(validUser.password, user.password);
            expect(passwordMatch).toBe(true);

            const budget = await budgetSchema.findOne({ username: validUser.username });
            expect(budget).not.toBeNull();
            expect(budget.montant).toBe(0);

            const finance = await financeSchema.findOne({ username: validUser.username });
            expect(finance).not.toBeNull();
            expect(finance.totalExpense).toBe(0);
            expect(finance.totalIncome).toBe(0);
            expect(finance.solde).toBe(0);
            expect(finance.budget).toBe(0);
        });

        it('should return 400 if username or password is missing', async () => {
            const response = await request(server)
                .post('/api/auth')
                .send({ username: 'testUser' }); // Missing password

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('username and password are required');
        });

        it('should return 400 if password is too short', async () => {
            const response = await request(server)
                .post('/api/auth')
                .send(shortPasswordUser);

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('The password must have at least 5 characters');
        });

        it('should return 400 if username already exists', async () => {

            // create new user
            const newUserResponse = await request(server)
            .post('/api/auth')
            .send( { username: 'existingUser', password: 'testPassword'});
            expect(newUserResponse.status).toBe(201);
            expect(newUserResponse.body.message).toEqual('user created');

            // create existing user
            const existingUserResponse = await request(server)
                .post('/api/auth')
                .send(existingUser);

            expect(existingUserResponse.status).toBe(401);
            expect(existingUserResponse.body.message).toContain('username already exist');
        });

        it('should handle errors gracefully', async () => {
            jest.spyOn(userSchema, 'create').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(server)
                .post('/api/auth')
                .send(validUser);

            expect(response.status).toBe(500);
            expect(response.body.message).toContain('Something went wrong: Database error');
        });
    });
});
