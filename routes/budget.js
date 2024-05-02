const express = require("express")


const router = express.Router()

router.get('/budget', (req, res) =>{
    const data = {
        tittle : 'budget',
        montant : 70000,
    }
    res.json(data)
})

router.put('/budget', (req, res) =>{
    res.send('put budget')
})

module.exports = router