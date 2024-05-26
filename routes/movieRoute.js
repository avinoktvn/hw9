const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");
const { authorization } = require("../middlewares/auth");

// CRUD
router.get("/", movieController.findAll);
router.get("/:id", movieController.findOne);
router.post("/", movieController.create);
router.put("/:id", movieController.update);
// ONLY USER

router.delete("/:id", authorization, movieController.destroy);

module.exports = router;
