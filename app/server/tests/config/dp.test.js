const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const connectDB = require('../../config/db');

jest.mock('mongoose', () => ({
    connect: jest.fn(),
}));

jest.mock('mongodb', () => ({
    MongoClient: jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockResolvedValueOnce(),
        db: jest.fn().mockReturnValue({
            command: jest.fn().mockResolvedValue({}),
        }),
        close: jest.fn().mockResolvedValue(),
    })),
}));

describe('Database Connection', () => {
    it('should connect to MongoDB and ping the deployment', async () => {
        await connectDB();

        expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const client = new MongoClient();
        expect(client.connect).toHaveBeenCalled();
        expect(client.db().command).toHaveBeenCalledWith({ ping: 1 });
        expect(client.close).toHaveBeenCalled();
    });

    it('should handle errors during connection', async () => {
        mongoose.connect.mockImplementationOnce(() => {
            throw new Error('Connection error');
        });

        const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

        await connectDB();

        expect(exitSpy).toHaveBeenCalledWith(1);
        exitSpy.mockRestore();
    });
});
