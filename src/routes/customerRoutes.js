const express = require("express");
const { createCustomer } = require("../controllers/customerController");

const router = express.Router();

router.post("/create-customers", createCustomer);

module.exports = router;