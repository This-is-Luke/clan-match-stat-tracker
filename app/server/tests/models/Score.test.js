const mongoose = require('mongoose');
const Score = require('../../models/Score');
const Match = require('../../models/Match');
const Clan = require('../../models/Clan');
const User = require('../../models/User');

describe('Score Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        await Score.deleteMany({});
        await Match.deleteMany({});
        await Clan.deleteMany({});
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new score for a match', async () => {
        const clan = new Clan({
            name: 'Test Clan',
            manager: new mongoose.Types.ObjectId()
        });
        const savedClan = await clan.save();

        const match = new Match({
            clan1: savedClan._id,
            clan2: new mongoose.Types.ObjectId(),
            date: new Date(),
            gameMode: 'Hardpoint'
        });
        const savedMatch = await match.save();

        const player = new User({
            gamerTag: 'PlayerGamer',
            userName: 'playeruser',
            name: 'Player User',
            email: 'playeruser@example.com',
            password: 'password123'
        });
        const savedPlayer = await player.save();

        const score = new Score({
            match: savedMatch._id,
            clan: savedClan._id,
            players: [savedPlayer._id],
            score: 100,
            gameModeStats: { kills: 10, deaths: 5 }
        });

        const savedScore = await score.save();
        expect(savedScore._id).toBeDefined();
        expect(savedScore.match).toEqual(savedMatch._id);
        expect(savedScore.clan).toEqual(savedClan._id);
        expect(savedScore.players.length).toBe(1);
        expect(savedScore.players[0]).toEqual(savedPlayer._id);
        expect(savedScore.score).toBe(100);
        expect(savedScore.gameModeStats.kills).toBe(10);
    });
});
