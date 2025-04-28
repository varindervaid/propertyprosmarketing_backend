const axios = require("axios");
const userHelper = require("./userHelper");
const API_KEY = process.env.FIRST_PROMOTER_API_KEY;

const Promoter = require("../../models/Promoter");
const logger = require("./logger");

const createPromoter = async (email,userId) => {
  try {
    const response = await axios.post(
      "https://firstpromoter.com/api/v1/promoters/create",
      { email },
      {
        headers: {
          "X-API-KEY": API_KEY,
        },
      }
    );

    const data = response.data;
    let promoter = await Promoter.findOne({ promoterId: data.id });

    if (!promoter) {
      await userHelper.saveMeta(userId,"promoterId",data.id);
      promoter = new Promoter({
        promoterId: data.id,
        promoterData: data
      });
      await promoter.save();
    }
    logger.info(`referralLink created for ${email}`);
  } catch (error) {
    logger.error(`Error : ${error.response.data.message}`);
  }
};



module.exports = { createPromoter };


