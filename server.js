const express = require("express");   // For server communication
const mongoose = require("mongoose"); // For database management
const passport = require("passport"); // For authentication
const path = require("path");

const initializePassport = require('./passport-config')

// Import models
const User = require('./models/User');
const Question = require('./models/Question');

const app = express();
const PORT = 3000;

// Use EJS as view engine
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

// Routes
const { router: authenticationRouter} = require('./routes/authentication');
const commentsRouter = require('./routes/comments');
const questionsRouter = require('./routes/questions');
const profileRouter = require('./routes/profile');

app.use(express.urlencoded({ extended: false }));

app.use('/', authenticationRouter);
app.use('/', questionsRouter);
app.use('/', commentsRouter);
app.use('/', profileRouter);

const uri = "mongodb+srv://Codebook:D7SeTmolljnr4wKb@codebookcluster.6fowij0.mongodb.net/?retryWrites=true&w=majority"

// Connect to MongoDB database
mongoose.connect(uri)
.then(()=>{
  console.log('Mongoose connected');
})
.catch((e)=>{
  console.log('Mongoose connection failed');
})

// Initialize Passport
initializePassport(passport);

// Middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport for authentication
initializePassport(
  passport,
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

// Render home page
app.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: 'desc' });
    const isAuthenticated = req.isAuthenticated()
    res.render('home', { questions, isAuthenticated});
    } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
