const { Schema, default: mongoose} = require('mongoose')


const budgetShema = new Schema({
    
    montant: {
        type: Number,
        required: true
    },

    username : {
        type : String
    },
    data : {
        type : Date,
        default : new Date().toDateString()
    }
},)


module.exports = mongoose.model('Budget', budgetShema)
