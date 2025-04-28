const axios = require('axios');
const qs = require('qs');
const { getAccessToken } = require("../helper/ghlAuth");

const sendEmailRequest = async (data) => {
    console.log("data...",data)
    const GHL_ACCESS = await getAccessToken();
    const url = `https://services.leadconnectorhq.com/conversations/messages`;
    try {
        const response = await axios.post(url, qs.stringify(data), {
            headers: {
                Authorization: `Bearer ${GHL_ACCESS}`,
                Version: '2021-04-15',
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Request Error:", error.response?.data || error.message);
        throw error;
    }
};

module.exports = { sendEmailRequest };
