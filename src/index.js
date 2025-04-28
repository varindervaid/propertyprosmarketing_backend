require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const PromoterRoutes = require("./routes/PromoterRoutes");
const rewardfulRoutes = require("./routes/rewardfulRoutes");
const customerRoutes = require("./routes/customerRoutes")

const initCronJobs = require("../src/utils/helper/reportService");
initCronJobs();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/promoter", PromoterRoutes);
app.use("/api/v1/rewardful", rewardfulRoutes);
app.use("/api/v1/customers", customerRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));