const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('config');
const app = require('../../server');
const User = require('../../models/User');
const mongoose = require('mongoose');

describe('Auth Middleware', () => {
    beforeAll(async () => {
        await mongoose.connect(config.get('mongoURI'), { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should return 401 if no token is provided', async () => {
        const res = await request(app).get('/api/protectedRoute');
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe('No token, authorization denied');
    });

    it('should return 401 if token is invalid', async () => {
        const res = await request(app).get('/api/protectedRoute').set('x-auth-token', 'invalid-token');
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe('Token is not valid');
    });

    it('should populate req.user with the payload of a valid JWT', async () => {
        const payload = { user: { id: '12345' } };
        const token = jwt.sign(payload, config.get('jwtSecret'), { expiresIn: '1h' });
        const res = await request(app).get('/api/protectedRoute').set('x-auth-token', token);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('msg', 'This is protected data');
    });
});
