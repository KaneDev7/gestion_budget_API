const { Schema, default: mongoose} = require('mongoose')



const expenseShema = new Schema({
    title: {
        type: String,
        required: true
    },

    montant: {
        type: Number,
        required: true
    }
})


module.exports = mongoose.model('Expense',expenseShema)
