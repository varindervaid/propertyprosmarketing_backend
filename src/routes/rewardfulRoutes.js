const express = require("express");
const {getAffiliate, updateAffiliate, getCampaign, getCommissions, getReferrals, getPayouts,createNewAffiliateLink, rewardfulWebhook } = require("../controllers/rewardfulController");
// const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get("/get-affiliate/:id?", getAffiliate);
router.post("/update-affiliate/:id", updateAffiliate);
router.get("/get-campaign/:id?", getCampaign);
router.get("/get-commissions/", getCommissions);
router.get("/get-referrals/", getReferrals);
router.get("/get-payouts/", getPayouts);
router.post("/create-new-affiliate-link/",createNewAffiliateLink)
router.post("/rewardful-webhook", rewardfulWebhook);


module.exports = router;
