const { Schema, default: mongoose} = require('mongoose')


const budgetShema = new Schema({
    montant: {
        type: Number,
        required: true
    },
    username : {
        type : String
    }
})


module.exports = mongoose.model('Budget', budgetShema)
