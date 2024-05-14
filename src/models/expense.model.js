const { Schema, default: mongoose} = require('mongoose')



const expenseShema = new Schema({
    title: {
        type: String,
        required: true,
        minLength : [3, 'Le titre doit au minimum trois caractères'],
        maxLength : [20, 'Le titre ne doit pas dépasser 20 caractères'],
    },

    montant: {
        type: Number,
        required: true,
    },
    
    username : {
        type : String
    }
})




module.exports = mongoose.model('Expense',expenseShema)