const mongoose = require('mongoose')
const User = require('./User');


const HouseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    address: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userName: { type: String, required: true },
});


module.exports = mongoose.model('House', HouseSchema)