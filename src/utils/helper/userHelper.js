const mongoose = require('mongoose');
const { UserMeta } = require('../../models/User'); // Ensure correct path
const logger = require('./logger'); // Ensure correct path

const userHelper = {
  saveMeta: async (userId, key, data) => {
    try {
      if (!userId || !data) {
        throw new Error("Missing required parameters: userId or data.id");
      }

      const meta = new UserMeta({
        userId: new mongoose.Types.ObjectId(userId),
        key,
        value: data,
      });

      await meta.save();
      logger.info("User meta saved successfully");
    } catch (error) {
      logger.error("Error adding user meta:", error);
    }
  },
  getMeta: async (userId, key) => {  
    try {
      if (!userId || !key) {
        throw new Error("Missing required parameters: userId or key");
      }

      const meta = await UserMeta.findOne({ userId: new mongoose.Types.ObjectId(userId), key });

      if (!meta) {
        return null;
      }

      return meta.value;
    } catch (error) {
      logger.error("Error fetching user meta:", error);
      throw error;
    }
  }
};

// Export using CommonJS syntax
module.exports = userHelper;