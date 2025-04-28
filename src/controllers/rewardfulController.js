const axios = require("axios");
const { User } = require("../models/User");

const API_KEY = process.env.REWARDFUL_API_KEY;
const qs = require('qs');

const createAffiliate = async (affiliate) => {
  const url = 'https://api.getrewardful.com/v1/affiliates';

  try {
    const response = await axios.post(url, qs.stringify(affiliate), {
      headers: {
        Authorization: `Basic ${API_KEY}`,
      }
    });

    return {
      id: response?.data.id,
      url: response?.data.links.url,
      campaign: response?.data.campaign.name
    }

  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
};

const updateAffiliate = async (req, res) => {
  let id = req.params.id;
  let affiliateData = req.body;

  if (!id) {
    return res.status(400).json({ error: "Affiliate ID is required" });
  }

  const url = `https://api.getrewardful.com/v1/affiliates/${id}`;

  try {
    const response = await axios.put(url, qs.stringify(affiliateData), {
      headers: {
        Authorization: `Basic ${API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error updating affiliate:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Internal Server Error" });
  }
};

const getAffiliate = async (req, res) => {
  const affiliateId = req.params.id;
  let url = `https://api.getrewardful.com/v1/affiliates/`;

  if (affiliateId) {
    url += affiliateId;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${API_KEY}`,
      },
    });

    res.json(response.data);

  } catch (error) {
    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
};

const getCampaign = async (req, res) => {
  const affiliateId = req.params.id;
  let url = `https://api.getrewardful.com/v1/campaigns/`;

  if (affiliateId) {
    url += affiliateId;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching affiliate:", error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
};

const getCommissions = async (req, res) => {
  const { affiliate_id, commissionId } = req.query;

  let url = `https://api.getrewardful.com/v1/commissions`;
  if (affiliate_id) {
    url += `?expand[]=sale`;
    const params = new URLSearchParams();
    if (affiliate_id) params.append("affiliate_id", affiliate_id);

    if (params.toString()) {
      url += `&${params.toString()}`;
    }
  } else {
    url += commissionId ? `/${commissionId}` : '';
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching commissions:", error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
};

const getReferrals = async (req, res) => {
  const { affiliate_id } = req.query;
  let url = `https://api.getrewardful.com/v1/referrals?conversion_state[]=lead&conversion_state[]=conversion`;

  const params = new URLSearchParams();

  // if (conversion_state) params.append("conversion_state", conversion_state);
  if (affiliate_id) params.append("affiliate_id", affiliate_id);

  if (params.toString()) {
    url += `&${params.toString()}`;
  }

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching affiliate:", error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
};

const getPayouts = async (req, res) => {
  const { affiliate_id, payoutId } = req.query;
  let url = `https://api.getrewardful.com/v1/payouts`;

  const params = new URLSearchParams();
  if (affiliate_id) {
    params.append("affiliate_id", affiliate_id);
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
  } else {
    url += payoutId ? `/${payoutId}` : '';
  }


  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${API_KEY}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching affiliate:", error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Internal Server Error",
    });
  }
};

const createNewAffiliateLink = async (req, res) => {
  let url = 'https://api.getrewardful.com/v1/affiliate_links';

  try {
    const affiliate = req.body;
    const response = await axios.post(url, qs.stringify(affiliate), {
      headers: {
        Authorization: `Basic ${API_KEY}`,
      }
    });
    console.log("response>>>//////////////", response)

    if (response.data) {
      res.status(200).json({ success: true, data: response.data });
    } else {
      res.status(200).json({ success: false, data: response.data });
    }

  } catch (error) {
    res.status(500).json({ error: error.response?.data?.details[0] || error.response?.data?.error });
  }
};

const rewardfulWebhook = async (req, res) => {
  try {
    const type = req.body?.event?.type;
    if (type == 'affiliate.deleted') {
      const email = req.body?.object?.email;
      if (!email) return res.status(400).send("Email not found in webhook payload");
      await User.deleteOne({ email });
      console.log(`User with email ${email} deleted.`);
      res.status(200).send("Webhook processed successfully");
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Error processing webhook");
  }
};




module.exports = { createAffiliate, updateAffiliate, getAffiliate, getCampaign, getCommissions, getReferrals, getPayouts, createNewAffiliateLink, rewardfulWebhook };


