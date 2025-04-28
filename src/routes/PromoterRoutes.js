const express = require("express");
const { getPromoter } = require("../controllers/PromoterController");
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/get-promoter", getPromoter);

module.exports = router;