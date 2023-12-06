const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router = express.Router();

const User = require('../models/User');

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

router.post('/signUp', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new User instance using the User model
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      // Save the user to the MongoDB collection named "users"
      await newUser.save();
      res.redirect('/login');
    } catch (error) {
      // Handle uniqueness constraint violation
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        console.error('Error creating user:', error);
        res.render('signUp', { error: 'Email already exists' });
      } else if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        console.error('Error creating user:', error);
        res.render('signUp', { error: 'Username already exists' });
      } else {
        throw error; // Rethrow other errors
      }
    }
    } catch (error) {
      console.error('Error creating user:', error);
      res.redirect('/signUp');
    }
});

// This is used in sign up page to check if username or email already exists in the database
router.get('/check-unique', async (req, res) => {
  const field = req.query.field; // 'username' or 'email'
  const value = req.query.value;

  try {
    // Check if the value exists in the database
    const existingUser = await User.findOne({ [field]: value });

    // Send a JSON response indicating whether the value is unique
    res.json({ unique: !existingUser });
  } catch (error) {
    console.error('Error checking uniqueness:', error);

    // Send a JSON response with an error message
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;