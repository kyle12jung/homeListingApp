const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    metadata: { type: Object },
    uploadDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('File', fileSchema)