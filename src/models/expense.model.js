const { Schema, default: mongoose} = require('mongoose')



const expenseShema = new Schema({
    title: {
        type: String,
        required: true,
        minLength : [3, 'Le titre doit avoir au minimum trois caractères'],
        maxLength : [20, 'Le titre ne doit pas dépasser 20 caractères'],
    },

    montant: {
        type: Number,
        required: true,
        min: [0, 'La valeur du montant doit rester positive']
    },
    
    username : {
        type : String
    },

    createdAt: {
        type: Date,
        default: Date.now 
    }
})




module.exports = mongoose.model('Expense',expenseShema)