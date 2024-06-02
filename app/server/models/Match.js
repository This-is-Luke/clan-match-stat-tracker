const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    clan1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clan',
        required: true
    },
    clan2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clan',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    gameMode: {
        type: String,
        required: true,
        enum: ['Hardpoint', 'Domination', 'Search and Destroy']
    },
    scores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Score'
        }
    ],
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Match', MatchSchema);
