const mongoose = require('mongoose');
const Clan = require('../../models/Clan');
const User = require('../../models/User');

describe('Clan Model', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterEach(async () => {
        await Clan.deleteMany({});
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new clan with a manager', async () => {
        const user = new User({
            gamerTag: 'ManagerGamer',
            userName: 'manageruser',
            name: 'Manager User',
            email: 'manageruser@example.com',
            password: 'password123'
        });
        const savedUser = await user.save();

        const clan = new Clan({
            name: 'Test Clan',
            manager: savedUser._id
        });

        const savedClan = await clan.save();
        expect(savedClan._id).toBeDefined();
        expect(savedClan.name).toBe('Test Clan');
        expect(savedClan.manager).toEqual(savedUser._id);
    });

    it('should add members to a clan', async () => {
        const manager = new User({
            gamerTag: 'ManagerGamer',
            userName: 'manageruser',
            name: 'Manager User',
            email: 'manageruser@example.com',
            password: 'password123'
        });
        const savedManager = await manager.save();

        const member = new User({
            gamerTag: 'MemberGamer',
            userName: 'memberuser',
            name: 'Member User',
            email: 'memberuser@example.com',
            password: 'password123'
        });
        const savedMember = await member.save();

        const clan = new Clan({
            name: 'Test Clan',
            manager: savedManager._id,
            members: [savedMember._id]
        });

        const savedClan = await clan.save();
        expect(savedClan.members.length).toBe(1);
        expect(savedClan.members[0]).toEqual(savedMember._id);
    });
});
