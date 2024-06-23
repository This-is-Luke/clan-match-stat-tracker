const request = require('supertest');
const express = require('express');
const { check } = require('express-validator');
const validate = require('../../middleware/validate');

const app = express();
app.use(express.json());

app.post('/test', [
    check('email', 'Please include a valid email').isEmail(),
    validate
], (req, res) => {
    res.send('Validation test');
});

describe('Validation Middleware', () => {
    it('should return 400 if validation fails', async () => {
        const res = await request(app)
            .post('/test')
            .send({ email: 'invalid-email' });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors[0].msg).toBe('Please include a valid email');
    });

    it('should proceed if validation passes', async () => {
        const res = await request(app)
            .post('/test')
            .send({ email: 'test@example.com' });
        expect(res.statusCode).toBe(200);
        expect(res.text).toBe('Validation test');
    });
});
