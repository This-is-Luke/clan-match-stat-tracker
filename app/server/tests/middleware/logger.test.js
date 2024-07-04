const request = require('supertest');
const express = require('express');
const logger = require('../../middleware/logger');

const app = express();

app.use(logger);

app.get('/test', (req, res) => {
    res.send('Logger test');
});

describe('Logger Middleware', () => {
    it('should log the request method and URL', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        await request(app).get('/test');
        expect(consoleSpy).toHaveBeenCalledWith('GET /test');
        consoleSpy.mockRestore();
    });
});
