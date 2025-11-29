const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/categoriesController");

// GET /api/categories
router.get("/", ctrl.getAll);
// GET /api/categories/:id
router.get("/:id", ctrl.getOne);
// POST /api/categories
router.post("/", ctrl.create);
// PUT /api/categories/:id
router.put("/:id", ctrl.update);
// DELETE /api/categories/:id
router.delete("/:id", ctrl.remove);

module.exports = router;
