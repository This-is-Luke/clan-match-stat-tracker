const mongoose = require('mongoose');
const Match = require('../../models/Match');
const Clan = require('../models/Clan');

describe('Match Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        await Match.deleteMany({});
        await Clan.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new match between two clans', async () => {
        const clan1 = new Clan({
            name: 'Clan One',
            manager: new mongoose.Types.ObjectId()
        });
        const savedClan1 = await clan1.save();

        const clan2 = new Clan({
            name: 'Clan Two',
            manager: new mongoose.Types.ObjectId()
        });
        const savedClan2 = await clan2.save();

        const match = new Match({
            clan1: savedClan1._id,
            clan2: savedClan2._id,
            date: new Date(),
            gameMode: 'Hardpoint'
        });

        const savedMatch = await match.save();
        expect(savedMatch._id).toBeDefined();
        expect(savedMatch.clan1).toEqual(savedClan1._id);
        expect(savedMatch.clan2).toEqual(savedClan2._id);
        expect(savedMatch.gameMode).toBe('Hardpoint');
    });
});
