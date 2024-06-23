const request = require('supertest');
const express = require('express');
const errorHandler = require('../../middleware/errorHandler');

const app = express();

app.get('/error', (req, res) => {
    throw new Error('Test error');
});

app.use(errorHandler);

describe('Error Handler Middleware', () => {
    it('should handle errors and return 500 with error message', async () => {
        const res = await request(app).get('/error');
        expect(res.statusCode).toBe(500);
        expect(res.body.msg).toBe('Server error');
    });
});
