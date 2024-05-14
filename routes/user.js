
const express = require("express")
const { updatePassword } = require("../controllers/users")


const router = express.Router()
router.patch('/user/update/password',  updatePassword )


module.exports = router