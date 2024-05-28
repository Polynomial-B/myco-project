const mongoose = require("mongoose");

require("dotenv").config();

const Mushroom = require("./models/mushroom.js");
const User = require("./models/user.js")

const mushroomData = require("./seedData.js");

const adminData = {
  username: 'admin',
  password: 'admin',
  confirmPassword: 'admin',
  isAdmin: true
}

async function seed() {
  console.log("Seeding start...");

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("Connection successful...");

  // ! Clear database
  await mongoose.connection.db.dropDatabase();

  const admin = await User.create(adminData);
  const mushroomsWithAdmin = mushroomData.map(mushroom => ({ ...mushroom, createdBy: admin._id }));
  const testSeed = await Mushroom.create(mushroomsWithAdmin);

  console.log(testSeed);

  mongoose.disconnect();
}

seed();
