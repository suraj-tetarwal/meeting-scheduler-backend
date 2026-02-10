const express = require("express")
const router = express.Router()

const userController = require("../interface/user.controller")

router.post("/", userController.createUser)

router.get("/:id", userController.fetchUser)

module.exports = router