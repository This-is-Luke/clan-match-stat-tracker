const request = require('supertest');
const express = require('express');
const rateLimiter = require('../../middleware/rateLimiter');

const app = express();
app.use(rateLimiter);

app.get('/test', (req, res) => {
    res.send('Rate limiter test');
});

describe('Rate Limiter Middleware', () => {
    it('should allow requests under the rate limit', async () => {
        const res = await request(app).get('/test');
        expect(res.statusCode).toBe(200);
    });

    it('should limit requests exceeding the rate limit', async () => {
        for (let i = 0; i < 101; i++) {
            await request(app).get('/test');
        }
        const res = await request(app).get('/test');
        expect(res.statusCode).toBe(429);
        expect(res.body.message).toBe('Too many requests from this IP, please try again after 15 minutes');
    });
});
