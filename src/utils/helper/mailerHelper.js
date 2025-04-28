const fs = require("fs");
const qs = require('qs');
const path = require("path");
const axios = require('axios');
const handlebars = require("handlebars");
const CLIENT_PORTAL_URL = process.env.CLIENT_PORTAL_URL;
const { sendEmailRequest } = require("../functions/sendEmailService")

const sendOnBoardingMail = async (detail) => {

  let replacements = {
    first_name: detail.first_name,
    campaign_name: detail.affiliateData.campaign,
    email: detail.email,
    tempPassword: detail.tempPassword,
    // email : "rahul@gmail.com",
    link: detail.affiliateData.url,
    client_portal_url: CLIENT_PORTAL_URL,
    location_name: detail.location_name
  }

  const html = getEmailTemplate("welcomeEmail", replacements);
  const emailData = {
    type: "Email",
    contactId: detail.contact_id,
    html: html,
    subject: "onboard message",
    emailTo: detail.email
  };

  await sendEmailRequest(emailData);
  try {
    await sendEmailRequest(emailData);
    return;
  } catch (error) {
    logger.error(error || error.response?.data || error.message);
    return;
  }
}

const getEmailTemplate = (templateName, replacements) => {
  const templatePath = path.join(__dirname, "../../utils/email/", `${templateName}.html`);
  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);
  return template(replacements);
};

module.exports = { sendOnBoardingMail };