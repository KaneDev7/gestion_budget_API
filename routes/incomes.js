const express = require("express")
const incomeShema = require('../models/incomes')

const router = express.Router()

router.get('/incomes', (req, res) =>{
    res.send('get incomes')
})

router.post('/incomes', (req, res) =>{
    res.send('post incomes')
})

router.put('/incomes', (req, res) =>{
    res.send('put incomes')
})

router.delete('/incomes', (req, res) =>{
    res.send('delete incomes')
})

module.exports = router