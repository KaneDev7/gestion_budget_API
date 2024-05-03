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

// expenseShema.virtual("finaces",{
//     ref: 'Finance',
//     localField: '_id',
//     foreignField: 'expenses'
// })


module.exports = mongoose.model('Expense',expenseShema)
