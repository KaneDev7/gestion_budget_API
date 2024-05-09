const { Schema, default: mongoose } = require('mongoose')
const expenseShema = require('./expense')
const incomeShema = require('./incomes')


const financeShema = new Schema({
    totalExpense: {
        type: Number,
        required: true
    },

    totalIncome: {
        type: Number,
        required: true
    },
    
    username : {
        type : String
    },

    solde: {
        type: Number,
        required: false
    },

})

module.exports = mongoose.model('Finance',financeShema)
