const { Schema, default: mongoose } = require('mongoose')

const financeShema = new Schema({
    totalExpense: {
        type: Number,
    },

    totalIncome: {
        type: Number,
    },
    
    username : {
        type : String
    },

    solde: {
        type: Number,
    },

})

module.exports = mongoose.model('Finance',financeShema)
