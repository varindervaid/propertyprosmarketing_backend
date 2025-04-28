const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rememberMe: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

const UserMetaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  key: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }, // Supports multiple data types
}, { timestamps: true });

const UserMeta = mongoose.model("UserMeta", UserMetaSchema);

module.exports = { User, UserMeta };