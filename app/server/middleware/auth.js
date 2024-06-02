const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Role-based access control middleware
module.exports.role = function (roles) {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);
            if (!roles.includes(user.role)) {
                return res.status(403).json({ msg: 'Access denied' });
            }
            next();
        } catch (err) {
            res.status(500).json({ msg: 'Server error' });
        }
    };
};
