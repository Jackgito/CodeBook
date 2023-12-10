const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');

const { renderHomePage } = require('../functions/renderHomePage');
const { renderLoginPage } = require('../functions/renderLoginPage');

const router = express.Router();

const User = require('../models/User');

const LocalStrategy = require('passport-local').Strategy;

router.use(flash());
router.use(session({
  secret: "miX2405H5V8VYlQl8nVx", // Change this to a strong, randomly generated key
  resave: true,
  saveUninitialized: true
}));

router.use(passport.initialize()); // Initialize Passport on the router
router.use(passport.session()); 

// Passport local strategy configuration
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      // Find the user by email in the database
      const user = await User.findOne({ email });

      // If the user is not found or the password is incorrect, return an error
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      // If the credentials are valid, return the user object
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// Serialize user information for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

router.get("/login", (req, res) => {
  const isAuthenticated = req.isAuthenticated()
  if (isAuthenticated) {
    return res.render('home', { posts, isAuthenticated});
  }

  res.render("login");
});

router.get("/signUp", (req, res) => {
  const isAuthenticated = req.isAuthenticated()
  if (isAuthenticated) {
    return res.render('home', { posts, isAuthenticated});
  }
  res.render("signUp");
});

// Handle the login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      // Authentication failed, send a flash message to login page
      req.flash('error', 'Invalid email or password.');
      return res.render('login', { messages: req.flash() });
    }

    // Authentication succeeded
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Render the home page
      renderHomePage(req, res, req.isAuthenticated());
    });
  })(req, res, next);
});

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
      req.flash('success', 'Successfully signed up.'); // Optional success message
      res.render('login', { success: 'Successfully signed up.', messages: req.flash() });
    } catch (error) {
      // Handle uniqueness constraint violation
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        console.error('Error creating user:', error);
        req.flash('error', 'Email already exists.');
        res.render('signUp', { error: 'Email already exists.', messages: req.flash() }); // Pass flash messages to the view
      } else if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        console.error('Error creating user:', error);
        req.flash('error', 'Username already exists');
        res.render('signUp', { error: 'Username already exists.', messages: req.flash() }); // Pass flash messages to the view
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error creating user:', error);
    res.redirect('/signUp');
  }
});

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
        res.render('signUp', { message: 'Email already exists' });
      } else if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        console.error('Error creating user:', error);
        res.render('signUp', { message: 'Username already exists' });
      } else {
        throw error;
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

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Error logging out:', err);
      return res.status(500).send('Internal Server Error');
    }
    res.redirect('/login');
  });
});

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', "You must be logged in to post questions.");
  res.render('login', { messages: req.flash() }); // Redirect to the login page if not authenticated
};

module.exports = { router, ensureAuthenticated };