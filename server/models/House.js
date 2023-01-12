const mongoose = require('mongoose')

const HouseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    address: { type: String, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    description: String,
    price: { type: Number, required: true },
    image: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
})

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    metadata: { type: Object },
    uploadDate: { type: Date, default: Date.now }
});

const File = mongoose.model("File", fileSchema);

module.exports = mongoose.model('House', HouseSchema)