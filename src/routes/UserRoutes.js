const express = require("express");

const UserController = require("../controllers/UserController");
/* const checkAuth = require("../middlewares/check-auth"); */

const router = express.Router();

router.post("/signup", UserController.signup);
router.post("/setting", UserController.setting);
router.post("/login", UserController.login);
router.post("/enable", UserController.enable);
router.post("/disable", UserController.disable);
router.get("/:userId", UserController.getOneUser);
router.get("/", UserController.getAllUsers);

module.exports = router;
