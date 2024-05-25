const express = require("express");
const router = express.Router();
const useRoute = require("./userRoute");
const taskRoute = require("./taskRoute");
const { authentication } = require("../middlewares/auth");

router.use("/users", useRoute);
// ONLY USER
router.use(authentication);
router.use("/tasks", taskRoute);

module.exports = router;
