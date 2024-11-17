const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    model: { type: String, required: true }, // The name of the collection (e.g., 'User')
    count: { type: Number, default: 0 },    // The current count
});

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;
