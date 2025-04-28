const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, UserMeta } = require("../models/User");
const logger = require("../utils/helper/logger");
const userHelper = require("../utils/helper/userHelper");
const generateUsername = require("../utils/helper/generateUsername");
const { sendOnBoardingMail } = require("../utils/helper/mailerHelper");
const { createAffiliate } = require("./rewardfulController");

const registerFromWebhook = async (req, res) => {
    try {
        const { first_name, last_name, email, paypal_email, location, contact_id } = req.body;
        const { name: location_name } = location;
        let role = 'user';
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        let full_name = first_name + last_name;
        const username = await generateUsername(full_name);
        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        user = new User({
            username,
            first_name,
            last_name,
            email,
            password: hashedPassword,
        });

        await user.save();
        if (role) {
            await userHelper.saveMeta(user._id, "role", role);
        }

        if (paypal_email) {
            await userHelper.saveMeta(user._id, "paypal_email", paypal_email);
        }

        if (contact_id) {
            await userHelper.saveMeta(user._id, "contact_id", contact_id);
        }

        if (location) {
            await userHelper.saveMeta(user._id, "location", location);
        }

        logger.info(`User saved to database: ${email}`);

        let affiliate = { first_name, last_name, email, paypal_email }

        let affiliateData = await createAffiliate(affiliate);

        if (affiliateData) {

            if (affiliateData.id) {
                await userHelper.saveMeta(user._id, "affiliateId", affiliateData.id);
            }

            sendOnBoardingMail({ first_name, email, location_name, contact_id, tempPassword, affiliateData })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10h" });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username,
                first_name,
                last_name,
                email,
            },
            tempPassword,
            token,
        });

    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const identifier = email.includes("@") ? { email } : { username: email };
        const user = await User.findOne(identifier);

        if (!user) return res.status(400).json({ message: "Invalid Username" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "10h" });

        User.rememberMe = rememberMe;
        await user.save();

        const role = await userHelper.getMeta(user._id, "role");

        res.json({
            token,
            user: { id: user._id, username: user.username, full_name: user.full_name, email: user.email, country: user.country, role }
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

const getUserMeta = async (req, res) => {
    try {
        const { userId, key } = req.query;
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        let query = { userId };
        if (key) {
            query.key = key;
        }

        const userMeta = await UserMeta.findOne(query, { value: 1 });

        if (!userMeta) {
            return res.status(404).json({ message: "User metadata not found" });
        }

        res.status(200).json({
            userId,
            value: userMeta.value
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

const changePassword = async (req, res) => {
    try {
        const { id, "current_password": currentPassword, "new_password": newPassword, "confirm_password": confirmPassword } = req.body;

        if (!id || !currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match." });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

const checkEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format." });
        }

        const user = await User.findOne({ email: email }).exec();

        if (user) {
            return res.status(200).json({ success: true, exists: true, message: "Email is already registered." });
        } else {
            return res.status(200).json({ success: true, exists: false, message: "Email is available." });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};



module.exports = { registerFromWebhook, login, changePassword, getUserMeta, checkEmail };