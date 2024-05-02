const { Schema, default: mongoose} = require('mongoose')



const financeShema = new Schema({
    totalEpense: {
        type: Number,
        required: true
    },

    totalIncome: {
        type: Number,
        required: true
    },
    solde: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Finance',financeShema)
