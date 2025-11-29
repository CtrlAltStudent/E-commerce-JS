const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/categoriesController");
const auth = require("../middleware/auth");

// public
router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getOne);

// protected
router.post("/", auth, ctrl.create);
router.put("/:id", auth, ctrl.update);
router.delete("/:id", auth, ctrl.remove);

module.exports = router;
