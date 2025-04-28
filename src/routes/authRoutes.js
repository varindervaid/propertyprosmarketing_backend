const express = require("express");
const { registerFromWebhook,login, changePassword ,getUserMeta,checkEmail } = require("../controllers/authController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post("/register-webhook", registerFromWebhook);
router.post("/login", login);
router.post("/change-password", changePassword);
router.get("/get-user-meta",authMiddleware, getUserMeta);
router.post("/check-email",checkEmail)

module.exports = router;