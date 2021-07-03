const express = require("express");

const CategoryController = require("../controllers/CategoryController");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.post("/", CategoryController.addCategory);
router.get("/:categoryId", CategoryController.getOneCategory);
router.get("/", CategoryController.getAllCategories);
router.delete("/:categoryId", CategoryController.deleteCategory);
router.put("/:categoryId", CategoryController.updateCategory);

module.exports = router;
