const serverless = require("serverless-http");
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");

const Mushroom = require("../../models/mushroom.js");



const authRouter = require("../../controllers/auth.js");
const mushroomRouter = require("../../controllers/mushrooms.js");

mongoose.connect(process.env.MONGODB_URI);

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
    cookie: { secure: false }
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

