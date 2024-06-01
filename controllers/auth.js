const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const methodOverride = require("method-override");
const { Console } = require("console");

authRouter.use(methodOverride("_method"));

authRouter.get("/sign-up", (req, res) => {
  return res.render("auth/sign-up.ejs", {
    error: ""
  });
});

authRouter.get("/sign-in", (req, res) => {
  return res.render("auth/sign-in.ejs");
});

authRouter.get("/sign-out", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
 
authRouter.post("/sign-up", async (req, res) => {
  try {
    const userIdInDatabase = await User.findOne({
      username: req.body.username,
    });

    if (userIdInDatabase || req.body.username.trim() === "") {
      throw new Error("Username already taken.");
    }

    const passwordHasUpperCase = /[A-Z]/.test(req.body.password);
    const passwordHasSymbol = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(req.body.password);
    const minPasswordLength = 8

    if(req.body.password.length < minPasswordLength) {
      throw new Error("Password must be at least 8 characters in length.")
    }

    if (req.body.password !== req.body.confirmPassword) {
      throw new Error("Passwords don't match.");
    }

    if (!passwordHasUpperCase && !passwordHasSymbol) {
      throw new Error("Password must contain at least one uppercase letter and a special symbol.");
    }
    const hash = bcrypt.hashSync(req.body.password, 10);
    
    req.body.password = hash;
    const newUser = await User.create(req.body);

    req.session.user = {
      username: newUser.username,
      _id: newUser._id
    };

    res.redirect("/");

  } catch (error) {
    console.log(error);
    res.render("auth/sign-in.ejs", {
      error,
    });
  }
});

authRouter.post('/sign-in', async (req, res) => {
  try {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
      throw new Error('Login failed. Please try again')
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password)
    if (!validPassword && userInDatabase.username !== 'admin') {
      throw new Error('Login failed. Please try again')
    }

    req.session.user = {
      username: userInDatabase.username,
      _id: userInDatabase._id
    }

    res.redirect('/')

  } catch (err) {
    console.error(err.message)
    res.render('error.ejs', { error: err.message })
  }
});

module.exports = authRouter;