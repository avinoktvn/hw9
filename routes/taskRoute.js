const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { authorization } = require("../middlewares/auth");

// CRUD
router.get("/", taskController.findAll);
router.get("/:id", taskController.findOne);
router.post("/", taskController.create);
router.put("/:id", taskController.update);
// ONLY USER

router.delete("/:id", authorization, taskController.destroy);

module.exports = router;
