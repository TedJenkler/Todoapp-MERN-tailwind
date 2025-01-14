const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    columns: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Column'
    }],
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Board', boardSchema);