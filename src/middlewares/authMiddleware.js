const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); 

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.split(' ')[1]; 
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.RequestUserId = decoded.id; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};


module.exports = authMiddleware;