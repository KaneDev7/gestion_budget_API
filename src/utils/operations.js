
const expenseShema = require('../models/expense.model')
const incomeShema = require('../models/incomes.model')


const getTotalExpense = async (username) => {
    try {
        const expenses = await expenseShema.find({ username })
        if (expenses.length < 1) return 0
        const result = await expenseShema.aggregate([
            {
                $match: { username }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$montant" }
                }
            }
        ]);

        return result.length > 0 ? result[0].total : 0;
    } catch (error) {
        console.error(error);
    }
}


const getTotalIncomes = async (username) => {
    try {
        const incomes = await incomeShema.find({ username })
        if (incomes.length < 1 ) return 0

        const result = await incomeShema.aggregate([
            {
                $match: { username }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$montant" }
                }
            }
        ])
        return result.length > 0 ? result[0].total : 0;
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    getTotalExpense,
    getTotalIncomes
}