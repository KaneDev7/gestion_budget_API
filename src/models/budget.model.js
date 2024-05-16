const { Schema, default: mongoose} = require('mongoose')


const budgetShema = new Schema({
    
    montant: {
        type: Number,
        required: true,
        min: [0, 'La valuer du montant doit rester positive']
    },

    username : {
        type : String
    },

    createdAt: {
        type: Date,
        default: Date.now 
    }

},)


module.exports = mongoose.model('Budget', budgetShema)
