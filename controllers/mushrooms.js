const express = require("express");
const router = express.Router();
const Mushroom = require("../models/mushroom.js");

// ? All controllers /mushrooms

router.get("/new", (req, res) => {
  res.render("mushrooms/new.ejs")
})

router.get("/:id", async (req, res) => {
  try {
    const mushroomId = req.params.id;
    const foundMushroom = await Mushroom.findById(mushroomId);
    res.render("mushrooms/show.ejs", {
      foundMushroom,
    });
  } catch (error) {
    res.render("error.ejs", {
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  if(req.session.user) {
    try {
      if(req.body.isEdible === "on") {
        req.body.isEdible = true
      } else {
        req.body.isEdible = false
      }
      req.body.createdBy = req.session.user._id
      const newMushroom = await Mushroom.create(req.body)
      res.redirect(`/mushrooms/${newMushroom._id}`)
    } catch (error) {
      console.log(error.message);
    }
  } else {
    res.redirect("/auth/sign-in")
  }
} );




module.exports = router;
