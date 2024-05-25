const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");

// REST API METHOD
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
