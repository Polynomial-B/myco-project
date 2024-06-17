const serverless = require("serverless-http");
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const Mushroom = require("../../models/mushroom.js");
const authRouter = require("../../controllers/auth.js");
const mushroomRouter = require("../../controllers/mushrooms.js");
const MongoStore = require('connect-mongo');

async function connectToDb() {
  await mongoose.connect(process.env.MONGODB_URI);
}

connectToDb()

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));
 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days expiration
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false, // Set to true if using https
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);
 
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const mushroom = await Mushroom.find();
    res.render("index.ejs", {
      mushroom,
    });
  } catch (error) {
    res.send(500, "Data not found");
  }
});

app.use('/auth', authRouter);
app.use('/mushrooms', mushroomRouter);


app.get("*", function (req, res) {
  res.render("error.ejs", { error: "Go back, page not found!" });
});

module.exports.handler = serverless(app);