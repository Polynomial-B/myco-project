const express = require("express");
const router = express.Router();
const Mushroom = require("../models/mushroom.js");
const methodOverride = require("method-override");
const User = require("../models/user.js");

// ? All controllers /mushrooms

router.get("/new", (req, res) => {
  res.render("mushrooms/new.ejs")
})

router.get("/:id", async (req, res) => {
  try {
    const mushroomId = req.params.id;
    const foundMushroom = await Mushroom.findById(mushroomId);
    const createdById = await Mushroom.findById(req.params.id)
    res.render("mushrooms/show.ejs", {
      foundMushroom,
      createdById
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

router.delete("/:id", async (req, res) => {
    const createdById = await Mushroom.findById(req.params.id)
  if(req.session.user) {
    if (req.session.user.username === "admin" || createdById.createdBy.equals(req.session.user._id)) {
      try {
        const deleteId = req.params.id;
        await Mushroom.findByIdAndDelete(deleteId);
        res.redirect("/");
      } catch (error) {
        res.send(error.message)
      }
    } else {
      res.render("error.ejs", {
        error: 'You do not have permission to delete this page.'
      });
    };
  } else {
    res.redirect("/")
  };
});
 

router.get("/:id/edit", async (req, res) => {
  if (req.session.user) {
    const createdById = await Mushroom.findById(req.params.id)
    if (req.session.user.username === "admin" || createdById.createdBy.equals(req.session.user._id)) {
      try {
          const foundMushroom = await Mushroom.findById(req.params.id);
          res.render("mushrooms/edit.ejs", {
              mushroom: foundMushroom,
          });
      } catch (error) {
          res.render("error.ejs", {
              error,
          });
      }}
  } else {
    res.render("error.ejs", {
      error: 'You do not have permission to delete this page.'
  })
}
});

router.put("/:id", async (req, res) => {
  if (req.session.user) {
    if (req.session.user.username === "admin" || createdById.createdBy.equals(req.session.user._id)) {
    try {
        const updatedMushroom = await Mushroom.findByIdAndUpdate(
        req.params.id,
        req.body,
      );
      res.redirect(`${req.params.id}`);
    } catch (error) {
      res.render("error.ejs", {
        error,
      });
    }}
  } else {
    res.render("error.ejs", {
      error: 'You do not have permission to edit this page.'
  })
  }
});





module.exports = router;
