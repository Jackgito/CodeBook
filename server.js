//https://docs.google.com/document/d/1zSfVZcnv7FUnu6VxwKLXBPZHqTIdRX1w3d9Yer_mKVU/edit#heading=h.z9sfsn1d1vz6

const express = require("express");   // For server communication
const bcrypt = require('bcrypt');     // For password hashing
const mongoose = require("mongoose"); // For database management
const passport = require("passport"); // For authentication
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
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
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
