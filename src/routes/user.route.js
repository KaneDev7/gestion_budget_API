
const express = require("express")
const { updatePassword, deleteUser } = require("../controllers/users.controller")


const router = express.Router()
router.patch('/api/user/edit/password',  updatePassword )
router.delete('/api/user',  deleteUser )


module.exports = router