const request = require('supertest');
const mongoose = require('mongoose');
const expenseSchema = require('../../src/models/expense.model');
const financeSchema = require('../../src/models/finance.model');
const budgetSchema = require('../../src/models/budget.model')
const mongoDbMemory = require('../../configs/dbMemo')
let server = require('../../src/app');
const { TEST_VALID_TOKEN, TEST_VALID_USERNAME } = require('../../src/constants/constants');
const invalidToken = '12354'


describe('expenses route', () => {

  beforeAll(async () =>{
    await mongoDbMemory.connect()
 })

  beforeEach(async () => {
    // the token contain omar as username
    await budgetSchema.create({ username: TEST_VALID_USERNAME, montant: 0 })
    await financeSchema.create({ username: TEST_VALID_USERNAME, totalExpense: 0, totalIncome: 0, solde: 0, budget: 0 })
  })


  afterEach(async () => {
    await expenseSchema.deleteMany()
    await budgetSchema.deleteMany()
    await financeSchema.deleteMany()
  })

  afterAll(async () =>{
    await mongoDbMemory.disconnect()
 })

  // ------------GET------------
  describe('GET /api/expenses ', () => {
    it('should return expenses with status 200', async () => {
      // we post expenses data before geting theme
      await request(server).post('/api/expense')
        .send({
          title: 'Test Expense',
          montant: 100,
        })
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      const getResponse = await request(server)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

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
      expect(getResponse.body.data).toEqual({})
    });
  })


  describe('GET /api/expenses with filters', () => {
    it('should return filtered expenses by montant', async () => {
      await expenseSchema.create([
        { title: 'Expense 1', montant: 50, username: TEST_VALID_USERNAME },
        { title: 'Expense 2', montant: 150, username: TEST_VALID_USERNAME },
        { title: 'Expense 3', montant: 250, username: TEST_VALID_USERNAME }
      ]);

      const response = await request(server)
        .get('/api/expenses?gt=100')
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].montant).toBeGreaterThan(100);
      expect(response.body.data[1].montant).toBeGreaterThan(100);
    });
  });


  describe('GET /api/expenses with pagination', () => {
    it('should return paginated expenses', async () => {
      await expenseSchema.create([
        { title: 'Expense 1', montant: 50, username: TEST_VALID_USERNAME },
        { title: 'Expense 2', montant: 150, username: TEST_VALID_USERNAME },
        { title: 'Expense 3', montant: 250, username: TEST_VALID_USERNAME },
        { title: 'Expense 4', montant: 350, username: TEST_VALID_USERNAME }
      ]);

      const response = await request(server)
        .get('/api/expenses?limit=2&page=2')
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

        console.log(response.body)
      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
    });
  });



  describe('GET /api/expenses with pagination', () => {
    it('should ingnore paginattion andt limit whene filter existe(gt=150) ', async () => {
      await expenseSchema.create([
        { title: 'Expense 1', montant: 50, username: TEST_VALID_USERNAME },
        { title: 'Expense 2', montant: 150, username: TEST_VALID_USERNAME },
        { title: 'Expense 3', montant: 200, username: TEST_VALID_USERNAME },
        { title: 'Expense 4', montant: 250, username: TEST_VALID_USERNAME },
        { title: 'Expense 5', montant: 300, username: TEST_VALID_USERNAME },
        { title: 'Expense 6', montant: 350, username: TEST_VALID_USERNAME }
      ]);

      const response = await request(server)
        .get('/api/expenses?limit=2&page=2&gt=150')
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(4);
      expect(response.body.data[2].montant).toEqual(300);
    });
  });


  // ------------POST------------
  describe('POST /api/expense', () => {
    it('should create an expense with valid data and update finance', async () => {

      // Set initial budget
      await request(server)
        .post('/api/budget')
        .send({
          montant: 1000,
        })
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      // put data to expenses before add new one
      await request(server)
        .post('/api/expense')
        .send({
          title: 'Expense',
          montant: 150,
        })
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      // finance state before add new expense 
      const getFinanceResponse = await request(server)
        .get(`/api/finances`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(getFinanceResponse.body.data[0]).toEqual(
        {
          budget: 850,
          totalExpense: 150,
          totalIncome: 0,
          solde: 700,
          createdAt: expect.anything(),
          __v: 0
        }
      );

      // add new expenses
      const postExpenseRespose = await request(server)
        .post('/api/expense')
        .send({
          title: 'new Expense',
          montant: 50,
        })
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(postExpenseRespose.status).toBe(201);
      expect(postExpenseRespose.body.message).toEqual('expense created and finance updated');

      // finance state after one expense is added
      const getFinanceResponseAfterExpenseAdded = await request(server)
        .get(`/api/finances`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(getFinanceResponseAfterExpenseAdded.status).toBe(200);
      expect(getFinanceResponseAfterExpenseAdded.body.data[0]).toEqual(
        {
          budget: 800, // 1000 - (150 + 50)
          totalExpense: 200, // 150 + 50
          totalIncome: 0,
          solde: 600,
          createdAt: expect.anything(),
          __v: 0
        }
      );
    });


    it('should return 400 if title is missing', async () => {
      const response = await request(server)
        .post('/api/expense')
        .send({
          montant: 150,
        })
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('`title` is required');
    });


    it('should return 400 if montant is missing', async () => {
      const response = await request(server)
        .post('/api/expense')
        .send({
          title: 'New Expense',
        })
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('`montant` is required');
    });
  });



  //------------DELETE---------------
  describe('DELETE /api/expense/:id', () => {
    it('should delete an expense by id and update finance', async () => {

      // Set initial budget
      await request(server)
        .post('/api/budget')
        .send({
          montant: 1000,
        })
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      // put some data to expenses before delete one
      await request(server)
        .post(`/api/expense`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`)
        .send({
          title: 'Expense1 to delete',
          montant: 60,
        })

      await request(server)
        .post(`/api/expense`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`)
        .send({
          title: 'Expense2 to delete',
          montant: 40,
        })


      // finance state before delete expense 
      const getFinanceResponse = await request(server)
        .get(`/api/finances`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(getFinanceResponse.status).toBe(200);
      expect(getFinanceResponse.body.data[0]).toEqual(
        {
          budget: 900, // 1000 - ( 60 + 40)
          totalExpense: 100, // 60 + 40
          totalIncome: 0,
          solde: 800,
          createdAt: expect.anything(),
          __v: 0
        }
      );

      // get expenses data to get id for deleting one after
      const getExpensesResponse = await request(server)
        .get(`/api/expenses`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);
      const expenseId = getExpensesResponse.body.data[0]._id // the expense id to delete

      // deleting one expenses 
      const deleteExpensesResponse = await request(server)
        .delete(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(deleteExpensesResponse.status).toBe(200);
      expect(deleteExpensesResponse.body.message).toEqual(`expense for id ${expenseId} deleted and finance updated`);
      const deletedExpense = await expenseSchema.findById(expenseId);
      expect(deletedExpense).toBeNull();

      // finance state after one expense is deleted
      const getFinanceResponseAfterExpenseDeleted = await request(server)
        .get(`/api/finances`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(getFinanceResponseAfterExpenseDeleted.status).toBe(200);
      expect(getFinanceResponseAfterExpenseDeleted.body.data[0]).toEqual(
        {
          budget: 960,
          totalExpense: 40, // 100 - 60
          totalIncome: 0,
          solde: 920, // 960 + (0 - 40)
          createdAt: expect.anything(),
          __v: 0
        }
      );
    });

    it('should return 400 if id missing', async () => {
      const expense = await expenseSchema.create({
        title: 'Expense to delete',
        montant: 50,
        username: TEST_VALID_USERNAME
      });

      const response = await request(server)
        .delete(`/api/expenses/10`)
        .set('Authorization', `Bearer ${TEST_VALID_TOKEN}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(`id unknown 10`);

    });
  });

})














