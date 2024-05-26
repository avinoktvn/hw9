const express = require("express");
const router = express.Router();
const useRoute = require("./userRoute");
const movieRoute = require("./movieRoute");
const { authentication } = require("../middlewares/auth");

router.use("/users", useRoute);
// ONLY USER
router.use(authentication);
router.use("/movies", movieRoute);

module.exports = router;
