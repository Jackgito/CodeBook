//https://docs.google.com/document/d/1zSfVZcnv7FUnu6VxwKLXBPZHqTIdRX1w3d9Yer_mKVU/edit#heading=h.z9sfsn1d1vz6

const express = require("express");   // For server communication
const bcrypt = require('bcrypt');     // For password hashing
const mongoose = require("mongoose"); // For database management
const passport = require("passport"); // For authentication
const session = require('express-session');
const flash = require('express-flash')
const path = require("path");

const initializePassport = require('./passport-config')

// Import models
const Question = require('./models/Question')
const User = require('./models/User');

const app = express();
const PORT = 3000;

// Use EJS as view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Routes
const authenticationRouter = require('./routes/authentication');
const questionsRouter = require('./routes/questions');

app.use(express.urlencoded({ extended: false }));

app.use('/', authenticationRouter);
app.use('/', questionsRouter);

// Connect to MongoDB database
mongoose.connect("mongodb://127.0.0.1:27017/codeshare")
.then(()=>{
  console.log('Mongoose connected');
})
.catch((e)=>{
  console.log('Mongoose connection failed');
})

// Configure express-session

// Initialize Passport
initializePassport(passport);

// Middleware
app.use(flash());
app.use(session({
  secret: "miX2405H5V8VYlQl8nVx", // Change this to a strong, randomly generated key
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport for authentication
initializePassport(
  passport,
  async email => {
    try {
      // Find user by email in the database
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  },
  async id => {
    try {
      // Find user by ID in the database
      const user = await User.findById(id);
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }
);

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  const posts = await Question.find().sort({ createdAt: 'desc' })
  res.render('home', { posts: posts })
})

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
