const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    match: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Match',
        required: true
    },
    clan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clan',
        required: true
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    score: {
        type: Number,
        required: true
    },
    gameModeStats: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Score', ScoreSchema);
