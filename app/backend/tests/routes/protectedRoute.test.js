const request = require('supertest');
const app = require('../../server');
const jwt = require('jsonwebtoken');
const config = require('config');

describe('Protected Route', () => {
    it('should return 401 if no token is provided', async () => {
        const res = await request(app).get('/api/protected');
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe('No token, authorization denied');
    });

    it('should return 200 with valid token', async () => {
        const token = jwt.sign({ user: { id: '12345' } }, config.get('jwtSecret'), { expiresIn: '1h' });
        const res = await request(app).get('/api/protected').set('x-auth-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('msg', 'This is protected data');
    });
});
