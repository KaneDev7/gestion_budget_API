const express = require('express')
const connectDB = require('../configs/dbConn')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const connect = require('../configs/dbMemo')
const bodyParser = require('body-parser')
const verifyToken = require('./Middlewares/verifyToken')
const log = require('./Middlewares/log')



const app = express()
require('dotenv').config()

const PORT = process.env.PORT || 3001

// middlewares 
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
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


// not found rout
app.use((req, res) => { res.status(404).json({ message: 'Not found' }); });

// connnet db
// connectDB()
// connect()

const server = app.listen(PORT, () => {
    console.log(`server run in port ${PORT}`)
})


module.exports = server
