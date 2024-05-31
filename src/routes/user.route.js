
const express = require("express")
const { updatePassword, deleteUser } = require("../controllers/users.controller")
const comparePassword = require('../Middlewares/comparePassword')
const { verifyPasswordInDb } = require("../Middlewares/verifyPasswordInDb")

const router = express.Router()
router.patch('/api/user/edit/password', comparePassword, verifyPasswordInDb, updatePassword )
router.delete('/api/user',  deleteUser )

module.exports = router