const { findExpensesByFilterAndSort, updateFinanceAfterExpensesChanged } = require('../../src/controllers/expense.controller');
const expenseSchema = require('../../src/models/expense.model');
const financeSchema = require('../../../../src/models/finance.model');
const budgetSchema = require('../../../../src/models/budget.model');
const { getTotalExpense, getTotalIncomes } = require('../../src/utils/operations');

jest.mock('../../../src/models/expense.model');
jest.mock('../../../src/models/finance.model');
jest.mock('../../../src/models/budget.model');
jest.mock('../../../src/utils/operations');

describe('Expense Controller - Unit Tests', () => {

  describe('findExpensesByFilterAndSort', () => {

    it('should find expenses with gt and lt filters', async () => {
      const mockExpenses = [{ montant: 100, title: 'Test', createdAt: new Date() }];
      
      expenseSchema.find.mockReturnValue({
        gt: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockExpenses),
      });

      const result = await findExpensesByFilterAndSort({ gt: 50, lt: 150 }, 'testUser');
      expect(result).toEqual(mockExpenses);
    });

    it('should find expenses with only gt filter', async () => {
      const mockExpenses = [{ montant: 100, title: 'Test', createdAt: new Date() }];
      expenseSchema.find.mockReturnValue({
        gt: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockExpenses),
      });

      const result = await findExpensesByFilterAndSort({ gt: 50 }, 'testUser');
      expect(result).toEqual(mockExpenses);
    });

    it('should find expenses with only lt filter', async () => {
      const mockExpenses = [{ montant: 100, title: 'Test', createdAt: new Date() }];
      expenseSchema.find.mockReturnValue({
        lt: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockExpenses),
      });

      const result = await findExpensesByFilterAndSort({ lt: 150 }, 'testUser');
      expect(result).toEqual(mockExpenses);
    });

    it('should find expenses with no filters', async () => {
      const mockExpenses = [{ montant: 100, title: 'Test', createdAt: new Date() }];
      expenseSchema.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockExpenses),
      });

      const result = await findExpensesByFilterAndSort({}, 'testUser');
      expect(result).toEqual(mockExpenses);
    });
  });

  describe('updateFinanceAfterExpensesChanged', () => {
    it('should update finance after expenses changed', async () => {
      const mockBudget = { montant: 1000 };
      const mockTotalExpense = 500;
      const mockTotalIncome = 2000;

      budgetSchema.findOne.mockResolvedValue(mockBudget);
      getTotalExpense.mockResolvedValue(mockTotalExpense);
      getTotalIncomes.mockResolvedValue(mockTotalIncome);

      await updateFinanceAfterExpensesChanged('testUser');

      expect(financeSchema.findOneAndUpdate).toHaveBeenCalledWith(
        { username: 'testUser' },
        { totalExpense: mockTotalExpense, solde: 2500 }
      );
      expect(budgetSchema.findOneAndUpdate).toHaveBeenCalledWith(
        { username: 'testUser' },
        { montant: 500 }
      );
    });
  });

});
