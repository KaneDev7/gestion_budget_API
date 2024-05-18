const request = require('supertest');
const mongoose = require('mongoose');
const expenseSchema = require('../../src/models/expense.model');
const financeSchema = require('../../src/models/finance.model');
const budgetSchema = require('../../src/models/budget.model')


const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9tYXIiLCJpYXQiOjE3MTU5NzA0ODEsImV4cCI6MTcyNjc5NzA0ODF9.f1Av4amrPrz9Uh0-ytsW9DVICULWWUKUseE9egscl0I'
const invalidToken = '12354'

let server

describe('expenses route', () => {

  beforeEach( async () => {
    server = require('../../src/app') // we initialize the server
    // the server initialize budget and finance data  after user is connected for first time 
    // we try to simulate this here
    // the token contain omar as username
    await budgetSchema.create({ username: 'omar', montant: 0 })
    await financeSchema.create({ username: 'omar', totalExpense: 0, totalIncome: 0, solde: 0 })
  })

  afterEach(async () => {
    server.close()
    await expenseSchema.deleteMany()
    await budgetSchema.deleteMany()
    await financeSchema.deleteMany()

  })


  // ------------GET------------
  describe('GET /api/expenses ', () => {

    it('should return expenses with status 200', async () => {

      // we post expense data befor geting theme
      await request(server).post('/api/expense')
        .send({
          title: 'Test Expense',
          montant: 100,
        })
        .set('Authorization', `Bearer ${validToken}`);


      // we try to get expenses data after posting theme befor
      const getResponse = await request(server)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${validToken}`);


      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data).toEqual([
        {
          title: 'Test Expense',
          montant: 100,
          _id: expect.anything(),
          createdAt: expect.anything(),
        }
      ])
    });



    it('should return 401 for invalid token', async () => {

      // we post expense data befor geting theme
      await request(server).post('/api/expense')
        .send({
          title: 'Test Expense',
          montant: 100,
        })
        .set('Authorization', `Bearer ${invalidToken}`);


      // we try to get expenses data after posting theme befor
      const getResponse = await request(server)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${invalidToken}`);


      expect(getResponse.status).toBe(401);
      expect(getResponse.body.message).toEqual('jwt malformed')
    });

  })

  describe('GET /api/expenses with filters', () => {
    it('should return filtered expenses by montant', async () => {
      await expenseSchema.create([
        { title: 'Expense 1', montant: 50, username: 'omar' },
        { title: 'Expense 2', montant: 150, username: 'omar' },
        { title: 'Expense 3', montant: 250, username: 'omar' }
      ]);

      const response = await request(server)
        .get('/api/expenses?gt=100')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].montant).toBeGreaterThan(100);
      expect(response.body.data[1].montant).toBeGreaterThan(100);
    });
  });


  describe('GET /api/expenses with pagination', () => {
    it('should return paginated expenses', async () => {
      await expenseSchema.create([
        { title: 'Expense 1', montant: 50, username: 'omar' },
        { title: 'Expense 2', montant: 150, username: 'omar' },
        { title: 'Expense 3', montant: 250, username: 'omar' },
        { title: 'Expense 4', montant: 350, username: 'omar' }

      ]);

      const response = await request(server)
        .get('/api/expenses?limit=2&page=2')
        .set('Authorization', `Bearer ${validToken}`);

        console.log('response filter', response.body)

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[1].montant).toEqual(350);
    });
  });


  // ------------POST------------
  describe('POST /api/expense', () => {


    it('should create an expense with valid data', async () => {


      await request(server).post('/api/finance')
        .send({
          montant: 100,
        })
        .set('Authorization', `Bearer ${validToken}`);


      const response = await request(server)
        .post('/api/expense')
        .send({
          title: 'New Expense',
          montant: 150,
        })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(201);
      expect(response.body.message).toEqual('expense created, budget, solde and total expense updated');
    });


    it('should return 400 if title is missing', async () => {

      const response = await request(server)
        .post('/api/expense')
        .send({
          montant: 150,
        })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('`title` is required');
    });



    it('should return 400 if montant is missing', async () => {

      const response = await request(server)
        .post('/api/expense')
        .send({
          title: 'New Expense',
        })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('`montant` is required');
    });
  });


  describe('DELETE /api/expense/:id', () => {


    it('should delete an expense by id', async () => {
      const expense = await expenseSchema.create({
        title: 'Expense to delete',
        montant: 50,
        username: 'omar'
      });

      console.log('expense', expense)

      const response = await request(server)
        .delete(`/api/expenses/${expense._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toEqual(`expense for id ${expense._id} deleted solde and total expense updated`);

      const deletedExpense = await expenseSchema.findById(expense._id);
      expect(deletedExpense).toBeNull();
    });

    it('should return 400 if id missing', async () => {
      const expense = await expenseSchema.create({
        title: 'Expense to delete',
        montant: 50,
        username: 'omar'
      });


      const response = await request(server)
        .delete(`/api/expenses/10`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(`id un known 10`);
    });
  });

})














