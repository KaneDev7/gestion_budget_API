const request = require('supertest');
const userSchema = require('../../src/models/users.model')
const expenseSchema = require('../../src/models/expense.model')
const incomeSchema = require('../../src/models/incomes.model')
const financeSchema = require('../../src/models/finance.model')
const budgetSchema = require('../../src/models/budget.model')
const mongoDbMemory = require('../../configs/dbMemo');
const bcrypt = require('bcrypt')

const server = require('../../src/app');

const validUser = { username: 'omar', password: 'testPassword' };
const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tYXIiLCJpYXQiOjE3MTU5NzA0ODEsImV4cCI6MTcyNjc5NzA0ODF9.f1Av4amrPrz9Uh0-ytsW9DVICULWWUKUseE9egscl0I';
const invalidToken = '12354';

describe('User Management', () => {
    beforeAll(async () => {
        await mongoDbMemory.connect();
    });

    afterAll(async () => {
        await mongoDbMemory.disconnect();
    });

    beforeEach(async () => {
        jest.clearAllMocks()
        // await userSchema.create({ username: 'omar', password: 'hashed_password' });
    });

    afterEach(async () => {
        jest.clearAllMocks()
        await userSchema.deleteMany();
        await expenseSchema.deleteMany();
        await incomeSchema.deleteMany();
        await financeSchema.deleteMany();
        await budgetSchema.deleteMany();
    });

    describe('PATCH /api/user/edit/password', () => {

        beforeEach(async () => {
            const newUserResponse = await request(server)
                .post('/api/auth')
                .send(validUser);

            expect(newUserResponse.status).toBe(201);
            expect(newUserResponse.body.message).toEqual('user created');

            // login should be successfull
            const userWithCorrectPasswordResponse = await request(server)
                .post('/api/login')
                .send({ username: 'omar', password: 'testPassword' });

            expect(userWithCorrectPasswordResponse.status).toBe(200);
            expect(userWithCorrectPasswordResponse.body.message).toBe('connected');
        })


        it('should update the password successfully', async () => {
            // we try to edit password for omar
            const currentPassword = 'testPassword'
            const newPassword = 'new_password';

            const response = await request(server)
                .patch('/api/user/edit/password')
                .send({ newPassword, currentPassword }) // current password is require to edit the password
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('your password is changed');

            // login should be wrong because the password is changed
            const userWithOldPasswordResponse = await request(server)
                .post('/api/login')
                .send({ username: 'omar', password: 'testPassword' });

            expect(userWithOldPasswordResponse.status).toBe(401);
            expect(userWithOldPasswordResponse.body.message).toContain('incorrect username or password');
        });

        it('should return 401 for invalid token', async () => {
            // we try to edit password for omar
            const currentPassword = 'testPassword'
            const newPassword = 'new_password';

            const response = await request(server)
                .patch('/api/user/edit/password')
                .send({ newPassword, currentPassword })
                .set('Authorization', `Bearer ${invalidToken}`);

            expect(response.status).toBe(401);
            expect(response.body.message).toEqual('jwt malformed')
        });

        it('should handle errors gracefully', async () => {

            const errorMessage = `Cannot read properties of null (reading 'password')`;
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
                throw new Error(errorMessage);
            });

            const response = await request(server)
                .patch('/api/user/edit/password')
                .send({ newPassword: 'new_password' })
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe(`Something went wrong: ${errorMessage}`);
        });
    });

    describe('DELETE /api/user', () => {
        it('should delete the user and associated data successfully', async () => {

            // register new user
            const newUserResponse = await request(server)
                .post('/api/auth')
                .send(validUser);

            expect(newUserResponse.status).toBe(201);
            expect(newUserResponse.body.message).toEqual('user created');

            // finance and budget modele must be initialize whene new user is created
            // lest check the budget model 
            const financeResponse = await request(server)
                .get('/api/finances')
                .set('Authorization', `Bearer ${validToken}`);

            expect(financeResponse.status).toBe(200);
            expect(financeResponse.body.data[0]).toEqual({
                totalExpense: 0,
                totalIncome: 0,
                solde: 0,
                budget: 0,
                createdAt: expect.anything(),
                __v: 0
            });

            const response = await request(server)
                .delete('/api/user')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Your acount is deleted');

            const user = await userSchema.findOne({ username: 'omar' });
            expect(user).toBeNull();

            const expenses = await expenseSchema.find({ username: 'omar' });
            expect(expenses.length).toBe(0);

            const incomes = await incomeSchema.find({ username: 'omar' });
            expect(incomes.length).toBe(0);

            const finances = await financeSchema.find({ username: 'omar' });
            expect(finances.length).toBe(0);

            const budgets = await budgetSchema.find({ username: 'omar' });
            expect(budgets.length).toBe(0);
        });

        it('should handle errors gracefully', async () => {
            const errorMessage = 'Deletion error';
            jest.spyOn(userSchema, 'deleteOne').mockImplementation(() => {
                throw new Error(errorMessage);
            });

            const response = await request(server)
                .delete('/api/user')
                .set('Authorization', `Bearer ${validToken}`);

            expect(response.status).toBe(500);
            expect(response.body.message).toBe(`Something went wrong: ${errorMessage}`);
        });
    });
});