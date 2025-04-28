const mongoose = require("mongoose");

const promoterSchema = new mongoose.Schema({
  promoterId: { type: Number, required: true, unique: true },
  promoterData: { type: mongoose.Schema.Types.Mixed }
});

module.exports = mongoose.model("Promoter", promoterSchema);