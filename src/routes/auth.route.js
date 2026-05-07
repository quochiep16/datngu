const express = require("express");
const authController = require("../controllers/auth.controller");
const {
  preventAuthPage,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/register", preventAuthPage, authController.showRegisterPage);
router.post("/register", preventAuthPage, authController.register);

router.get("/login", preventAuthPage, authController.showLoginPage);
router.post("/login", preventAuthPage, authController.login);

router.get("/logout", authController.logout);

module.exports = router;