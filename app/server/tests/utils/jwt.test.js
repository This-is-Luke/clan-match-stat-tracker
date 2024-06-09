const { generateToken, verifyToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');
const config = require('config');

describe('JWT Utility Functions', () => {
    it('should generate a valid JWT token', () => {
        const user = { id: '12345' };
        const token = generateToken(user);
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        expect(decoded.user.id).toBe(user.id);
    });

    it('should verify a valid JWT token', () => {
        const user = { id: '12345' };
        const token = jwt.sign({ user }, config.get('jwtSecret'), { expiresIn: '1h' });
        const decoded = verifyToken(token);
        expect(decoded.user.id).toBe(user.id);
    });

    it('should throw an error for invalid token', () => {
        expect(() => {
            verifyToken('invalid-token');
        }).toThrow();
    });
});
