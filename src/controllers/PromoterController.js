// const userHelper = require('../helpers/userHelper');
// const firstPromoterHelper = require('../helpers/firstPromoter');
// const logger = require('../helpers/logger');
const Promoter = require('../models/Promoter');
// const mongoose = require('mongoose');

const axios = require("axios");


const API_KEY = process.env.FIRST_PROMOTER_API_KEY;

const getPromoter = async (req, res) => {
    try {
        const { userpromoterId, load } = req.query;
        console.log("userpromoterId", userpromoterId);
        // return;
        let promoter = null;
        if (load) {
            const options = {
                method: 'GET',
                headers: { 'X-API-KEY': API_KEY }
            };
            const response = await axios.get(
                `https://firstpromoter.com/api/v1/promoters/show?id=${userpromoterId}`,
                options
            );
            promoter = response.data;
            await Promoter.findOneAndUpdate(
                { promoterId: userpromoterId },
                { $set: { promoterData: promoter } },
                { new: true }
            );
            res.status(200).json({ promoter });
        } else {
            promoter = await Promoter.findOne({ promoterId: userpromoterId });
            promoter = promoter.promoterData;
            res.status(200).json({ promoter });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPromoter };

