const qs = require("qs");
const axios = require("axios");
const cron = require("node-cron");

const logger = require("../helper/logger");
const generateMonthlyEmailHTML = require("../functions/generateAffiliateReport");
const { sendEmailRequest } = require("../functions/sendEmailService");
const userHelper = require("../helper/userHelper")
const { User } = require("../../models/User");

const API_KEY = process.env.REWARDFUL_API_KEY;

const sendMonthlyReports = async () => {
    try {
        const { data: response } = await axios.get("https://api.getrewardful.com/v1/affiliates?expand[]=links", {
            headers: {
                Authorization: `Basic ${API_KEY}`,
            },
        });
        const affiliates = response.data;

        if (!affiliates.length) {
            logger.info("No active affiliates found.");
            return;
        }
      
        for (const affiliate of affiliates) {
            const email = affiliate.email
            const identifier = email.includes("@") ? { email } : { username: email };
            const user = await User.findOne(identifier);

            let contact_id = await userHelper.getMeta(user._id, "contact_id");
            let location = await userHelper.getMeta(user._id, "location");           

            if (!affiliate.email || !contact_id) {
                logger.warn(`Missing email/contact ID for ${affiliate.first_name} ${affiliate.last_name}`);
                continue;
            }
          
            const totalVisitors = Array.isArray(affiliate.links)
                ? affiliate.links.reduce((sum, link) => sum + (link.visitors || 0), 0)
                : 0;
         
            const totalLeads = Array.isArray(affiliate.links)
                ? affiliate.links.reduce((sum, link) => sum + (link.leads || 0), 0)
                : 0;

            const totalConversions = Array.isArray(affiliate.links)
                ? affiliate.links.reduce((sum, link) => sum + (link.conversions || 0), 0)
                : 0;

            const commissionStats = affiliate?.commission_stats?.currencies?.USD || {
                unpaid: { cents: 0, currency_iso: "USD" },
                due: { cents: 0, currency_iso: "USD" },
                paid: { cents: 0, currency_iso: "USD" },
                total: { cents: 0, currency_iso: "USD" },
                gross_revenue: { cents: 0, currency_iso: "USD" },
                net_revenue: { cents: 0, currency_iso: "USD" },
            };

            const report = {
                month: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
                totalVisitors,
                totalLeads,
                totalConversions,
                commissionStats,
                location
            };

            const html = generateMonthlyEmailHTML(affiliate, report);

            const emailData = {
                type: "Email",
                contactId: contact_id,
                html: html,
                subject: `Monthly Report - ${report.month}`,
                emailTo: affiliate.email
            };
            try {
                await sendEmailRequest(emailData);
                logger.info(`✅ Report sent to ${affiliate.email}`);
                return;
            } catch (error) {
                logger.error(`❌ Error sending to ${affiliate.email}:`, error.response?.data || error.message);
                return;
            }
        }
    } catch (error) {       
        logger.error("❌ Failed to send monthly affiliate reports:", error || error.response?.data || error.message);
        return;
    }
};

const initCronJobs = () => {
    // Production (1st of every month at 8:00am)
    cron.schedule("0 8 1 * *", () => sendMonthlyReports());

    // For testing (runs every minute)
    // setTimeout(() => {
    //     cron.schedule("* * * * *", () => {
    //         console.log("🧪 Running test monthly report job...");
    //         sendMonthlyReports();
    //     });
    // }, 100)
};

module.exports = initCronJobs;

