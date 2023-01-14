const mongoose = require('mongoose')

const HouseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: [{ type: String }],
})

module.exports = mongoose.model('House', HouseSchema)