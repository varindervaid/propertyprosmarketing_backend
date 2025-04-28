const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_API_KEY);

const createCustomer = async (req, res) => {
    try {
        const { email } = req.body;
  
        const customers = await stripe.customers.list({ email: email });        
        if (customers.data.length > 0) {          
            return res.json({ success: true, customer: customers.data[0] });
        } else {
            const newCustomer = await stripe.customers.create({ email: email });           
            return res.json({ success: true, customer: newCustomer });

        }
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { createCustomer };







