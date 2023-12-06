//https://docs.google.com/document/d/1zSfVZcnv7FUnu6VxwKLXBPZHqTIdRX1w3d9Yer_mKVU/edit#heading=h.z9sfsn1d1vz6

const express = require("express");
const bcrypt = require('bcrypt'); // Used for password hashing
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

const Question = require('./models/Question')

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

// Database
mongoose.connect("mongodb://127.0.0.1:27017/codeshare")

// Passport for authentication
const initializePassport = require("./passport-config")
initializePassport(
  passport,
  async email => await User.findOne({ email }),
  async id => await User.findById(id),
)

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
