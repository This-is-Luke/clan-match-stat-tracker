const jwt = require('jsonwebtoken');
const config = require('config');

const jwtSecret = process.env.JWT_SECRET || config.get('jwtSecret');

// Generate a JWT token
const generateToken = (user) => {
    const payload = {
        user: {
            id: user.id
        }
    };

    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
};

// Verify a JWT token
const verifyToken = (token) => {
    return jwt.verify(token, jwtSecret);
};

module.exports = {
    generateToken,
    verifyToken
};
