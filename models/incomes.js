const { Schema} = require('mongoose')


const incomeShema = new Schema({
    title: {
        type: String,
        required: true
    },

    montant: {
        type: Number,
        required: true
    },
})


module.exports = mongoose.model('Income',incomeShema)
