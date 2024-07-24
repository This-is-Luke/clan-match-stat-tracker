const { generateRandomString } = require('../utils/helperFunctions');

describe('Helper Functions', () => {
    it('should generate a random string of the specified length', () => {
        const length = 10;
        const randomString = generateRandomString(length);
        expect(randomString).toHaveLength(length);
    });

    it('should generate different strings for subsequent calls', () => {
        const length = 10;
        const randomString1 = generateRandomString(length);
        const randomString2 = generateRandomString(length);
        expect(randomString1).not.toBe(randomString2);
    });
});
