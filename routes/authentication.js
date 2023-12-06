const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

router.get("/login", (req, res) => {
    res.render("login");
})
  
router.get("/signUp", (req, res) => {
    res.render("signUp");
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

router.post("/signUp", async (req, res) => {
    console.log(req.body.password);
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect("/login")
    } catch (error) {
      console.log(error)
      res.redirect("/signUp")
    }
    console.log(users)
  })

module.exports = router;