const mongoose = require('mongoose')

const mushroomSchema = new mongoose.Schema(
    {
        commonName: { type: String, required: true, unique: true, trim: true },
        scientificName: { type: String, required: true, unique: true, trim: true },
        isEdible: { type: Boolean, required: false, unique: false, default: false },
        image: { type: String, required: false, unique: false, trim: true },
        createdBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true }
    }
)

module.exports = mongoose.model('Mushroom', mushroomSchema);