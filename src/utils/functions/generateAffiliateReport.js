const fs = require("fs");
const path = require("path");

const generateMonthlyEmailHTML = (affiliate, report) => {

  const templatePath = path.join(__dirname, "../email/affiliateMonthlyReport.html");
  let template = fs.readFileSync(templatePath, "utf8");

  template = template.replace(/{{first_name}}/g, affiliate.first_name || "Affiliate");
  template = template.replace(/{{last_name}}/g, affiliate.last_name || "Affiliate");
  template = template.replace(/{{month}}/g, report.month);
  template = template.replace(/{{totalVisitors}}/g, report.totalVisitors);
  template = template.replace(/{{totalLeads}}/g, report.totalLeads);
  template = template.replace(/{{totalConversions}}/g, report.totalConversions);
  template = template.replace(/{{paid}}/g, (report.commissionStats.paid.cents / 100).toFixed(2));
  template = template.replace(/{{gross}}/g, (report.commissionStats.gross_revenue.cents / 100).toFixed(2));
  template = template.replace(/{{net}}/g, (report.commissionStats.net_revenue.cents / 100).toFixed(2));
  template = template.replace(/{{unpaid}}/g, (report.commissionStats.unpaid.cents / 100).toFixed(2));
  template = template.replace(/{{due}}/g, (report.commissionStats.due.cents / 100).toFixed(2));
  template = template.replace(/{{total}}/g, (report.commissionStats.total.cents / 100).toFixed(2));
  template = template.replace(/{{location_name}}/g, report.location.name || "");

  return template;
};

module.exports = generateMonthlyEmailHTML;
