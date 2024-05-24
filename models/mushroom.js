const mongoose = require('mongoose')

const mushroomSchema = new mongoose.Schema(
    {
        commonName: { type: String, required: true, unique: true, trim: true },
        scientificName: { type: String, required: true, unique: true, trim: true },
        isEdible: { type: Boolean, required: false, unique: false, default: false, trim: true },
        image: { type: String, required: false, unique: false, trim: true }

    }
)