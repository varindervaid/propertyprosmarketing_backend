const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  locationId: { type: String, required: true },
  companyId: { type: String, required: true },
  tokenType: { type: String, required: true },
  scope: { type: String, required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true }, 
  expiresAt: { type: Date, required: true }, 
  createdAt: { type: Date, default: Date.now },
});

tokenSchema.pre("save", function (next) {
  this.expiresAt = new Date(Date.now() + 1000 * 86399); 
  next();
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;