const express = require('express')
const connectDB = require('../configs/dbConn')
const bodyParser = require('body-parser')
const verifyToken = require('./Middlewares/verifyToken')
const log = require('./Middlewares/log')

const app = express()

require('dotenv').config()

const PORT = process.env.PORT || 3001
 
// connnet db
connectDB()

// middlewares 
app.use(bodyParser.json())

 
app.use(log)

// routes
app.use('/', require('./routes/auth.route'))  
app.use(verifyToken)
app.use('/', require('./routes/token.route'))
app.use('/', require('./routes/user.route'))
app.use('/', require('./routes/budget.route'))
app.use('/', require('./routes/finance.route'))
app.use('/', require('./routes/expense.route'))
app.use('/', require('./routes/incomes.route'))


app.listen(PORT, () =>{
    console.log(`server run in port ${PORT}`)
})