const axios = require("axios");
const Token = require("../../models/tokenModel");
const GHL_CLIENT_ID = process.env.GHL_CLIENT_ID;
const GHL_CLIENT_SECRET = process.env.GHL_CLIENT_SECRET;
const GHL_REFRESH_TOKEN = process.env.GHL_REFRESH_TOKEN;


const generateAccessToken = async (refreshTokenValue) => {
    try {
        const response = await axios.post(
            "https://services.leadconnectorhq.com/oauth/token",
            new URLSearchParams({
                client_id: GHL_CLIENT_ID,
                client_secret: GHL_CLIENT_SECRET,
                grant_type: "refresh_token",
                refresh_token: refreshTokenValue,
                user_type: "Location",
            }).toString(),
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        console.log("New Token Generated:", response.data);

        await Token.findOneAndUpdate(
            { userId: response.data.userId }, 
            {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token, 
                expiresAt: new Date(Date.now() + response.data.expires_in * 1000), 
            },
            { new: true, upsert: true } 
        );

        return response.data.access_token;
    } catch (error) {
        console.error("Error refreshing token:", error.response?.data || error.message);
        return null;
    }
};

const getAccessToken = async () => {
    let token = await Token.findOne().sort({ createdAt: -1 });

    if (token) {
        const now = new Date();
        if (token.expiresAt > now) {
            // console.log("Token is still valid:", token.accessToken);
            return token.accessToken;
        } else {
            console.log("Token expired. Generating a new one...");
            return generateAccessToken(token.refreshToken);
        }
    } else {
        console.log("No token found. Generating a new one...");
        return generateAccessToken(GHL_REFRESH_TOKEN); 
    }
};

module.exports = { getAccessToken };