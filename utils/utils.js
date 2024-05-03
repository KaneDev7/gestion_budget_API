
const expenseShema = require('../models/expense')
const incomeShema = require('../models/incomes')


const getTotalExpense = async () => {

    try {
        const result = await expenseShema.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$montant" }
                }
            }
        ])
        console.log('r', result[0].total)
        return result[0].total
    } catch (error) {
        console.error(err);
    }
   
}


const getTotalIncomes = async () => {
    try {
        const result = await incomeShema.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$montant" }
                }
            }
        ])
        return result[0].total
    } catch (error) {
        console.error(err);
    }
}

module.exports = {
    getTotalExpense,
    getTotalIncomes
}