const express = require('express')
const connectDB = require('./configs/dbConn')
const bodyParser = require('body-parser')
const verifyToken = require('./Middlewares/verifyToken')

const app = express()

require('dotenv').config()

const PORT = process.env.PORT || 3000

// connnet db
connectDB()

// middlewares 
app.use(bodyParser.json())


// routes
app.use('/', require('./routes/auth'))
app.use(verifyToken)
app.use('/', require('./routes/budget'))
app.use('/', require('./routes/finace'))
app.use('/', require('./routes/expense'))
app.use('/', require('./routes/incomes'))




app.listen(PORT, () =>{
    console.log(`server run in port ${PORT}`)
})