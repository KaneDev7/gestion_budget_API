
const expenseShema = require('../models/expense')
const incomeShema = require('../models/incomes')


const getTotalExpense = async (username) => {
    try {
        const result = await expenseShema.aggregate([
            {
                $match: {username} 
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$montant" }
                }
            }
        ]);
        return result[0].total

    } catch (error) {
        console.error(error); 
    }
}




const getTotalIncomes = async (username) => {
    try {
        const result = await incomeShema.aggregate([
            {
                $match: {username} 
            },
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