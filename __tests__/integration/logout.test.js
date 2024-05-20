const request = require('supertest');
const mongoose = require('mongoose');
const mongoDbMemory = require('../../configs/dbMemo');
const server = require('../../src/app');


const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tYXIiLCJpYXQiOjE3MTU5NzA0ODEsImV4cCI6MTcyNjc5NzA0ODF9.f1Av4amrPrz9Uh0-ytsW9DVICULWWUKUseE9egscl0I';
const invalidToken = '12354';

describe('User Logout', () => {
    beforeAll(async () => {
        await mongoDbMemory.connect();
    });

    afterAll(async () => {
        await mongoDbMemory.disconnect();
    });

    describe('GET /api/logout', () => {
        it('should logout the user successfully', async () => {
            const response = await request(server)
                .get('/api/logout')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('user deconeted');

            const cookie = response.headers['set-cookie'][0];
            expect(cookie).toContain('jwt=;');
        });

        it('should handle errors gracefully', async () => {
            const response = await request(server)
                .get('/api/logout')
                .set('Authorization', `Bearer ${invalidToken}`);

                expect(response.status).toBe(200);
                expect(response.body.message).toBe('user deconeted');
                const cookie = response.headers['set-cookie'][0];
                expect(cookie).toContain('jwt=;');
        });
    });
});
