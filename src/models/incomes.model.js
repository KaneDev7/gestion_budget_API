const { Schema, default: mongoose} = require('mongoose')


const incomeShema = new Schema({
    title: {
        type: String,
        required: true
    },

    montant: {
        type: Number,
        required: true,
    },
    
    username : {
        type : String,
    }
})

module.exports = mongoose.model('Income',incomeShema)