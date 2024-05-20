const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = require('../../src/models/users.model');
const mongoDbMemory = require('../../configs/dbMemo');
const server = require('../../src/app');

const validUser = { username: 'testUser', password: 'testPassword' };
const invalidPasswordUser = { username: 'testUser2', password: 'wrongPassword' };
const nonExistentUser = { username: 'nonExistentUser', password: 'testPassword' };

describe('User login', () => {
    beforeAll(async () => {
        await mongoDbMemory.connect();
        const passwordHash = await bcrypt.hash(validUser.password, 10);
        await userSchema.create({ username: validUser.username, password: passwordHash });
    });

    afterAll(async () => {
        await mongoDbMemory.disconnect();
    });

    beforeEach(async () => {
        jest.clearAllMocks();
    });

    describe('POST /api/login', () => {
        it('should log in a user with valid credentials', async () => {
            const response = await request(server)
                .post('/api/login')
                .send(validUser);

            expect(response.status).toBe(200);
            expect(response.body.message).toEqual('connected');
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.username).toEqual(validUser.username);

            const user = await userSchema.findOne({ username: validUser.username });
            expect(user).not.toBeNull();
            expect(user.token).toEqual(response.body.data.token);
        });

        it('should return 401 if username or password is missing', async () => {
            const response = await request(server)
                .post('/api/login')
                .send({ username: 'testUser' }); // Missing password

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('username and password are required');
        });

        it('should return 401 if username does not exist', async () => {
            const response = await request(server)
                .post('/api/login')
                .send(nonExistentUser);

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('incorrect username or password');
        });

        it('should return 401 if password is incorrect', async () => {
            const response = await request(server)
                .post('/api/login')
                .send(invalidPasswordUser);

            expect(response.status).toBe(401);
            expect(response.body.message).toContain('incorrect username or password');
        });

        it('should handle errors gracefully', async () => {
            jest.spyOn(userSchema, 'updateOne').mockImplementation(() => {
                throw new Error('Database error');
            });

            const response = await request(server)
                .post('/api/login')
                .send(validUser);

            expect(response.status).toBe(500);
            expect(response.body.message).toContain('Something went wrong: Database error');
        });
    });
});
