require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");
const path = require("path");

const Mushroom = require("./models/mushroom.js");
const User = require("./models/user.js");

const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

const authRouter = require("./controllers/auth.js");
const mushroomsRouter = require("./controllers/mushrooms.js");

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


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

app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});



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

app.get("/mushrooms/:id", async (req, res) => {
  try {
    const mushroomId = req.params.id;
    const foundMushroom = await Mushroom.findById(mushroomId);
    res.render("mushrooms/show.ejs", {
      foundMushroom
    });
  } catch (error) {
    res.render("error.ejs", {
      error: error.message
    });
  }
});


// app.use(passUserToView)
// app.use('/auth', authRouter)
// app.use(isSignedIn)
// app.use('/users/:userId/mushrooms', mushroomsRouter)



app.get("*", function (req, res) {
  res.render("error.ejs", { error: "Go back, page not found!" });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
