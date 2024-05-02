const express = require("express")


const router = express.Router()

router.get('/expenses', (req, res) =>{
    res.send('get expenses')
})

router.post('/expenses', (req, res) =>{
    res.send('post expenses')
})

router.put('/expenses', (req, res) =>{
    res.send('put expenses')
})

router.delete('/expenses', (req, res) =>{
    res.send('delete expenses')
})

module.exports = router