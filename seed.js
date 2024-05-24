const mongoose = require('mongoose')

require('dotenv').config()

const Mushroom = require('.models/mushroom.js')

const mushroomData = require('/seedData.js')

async function seed() {

console.log('Seeding start...')

await mongoose.connect(process.env.MONGODB_URI)

console.log('Connection successful...');

// ! Clear database
await mongoose.connection.db.dropDatabase()

const testSeed = await Mushroom.create(mushroomData)

console.log(testSeed);

mongoose.disconnect()

}

seed()