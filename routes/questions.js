const express = require("express");
const passport = require('passport');
const Question = require("../models/Question")
const router = express.Router();
const bodyParser = require('body-parser');

router.use(passport.initialize());
router.use(passport.session());
router.use(bodyParser.json());

const ensureAuthenticated = require('./authentication').ensureAuthenticated;

// Ask new question
router.get('/questions/new/question', ensureAuthenticated, (req, res) => {
  res.render('newQuestion', {
    isAuthenticated: {
      user: req.isAuthenticated() ? req.user.username : null,
      value: req.isAuthenticated(),
    }
  });
});

// Save a new question
router.post('/questions/:title', async (req, res) => {
  try {
      const url = encodeURIComponent(req.body.title)
      // Create a new Question document
      const newQuestion = new Question({
        title: req.body.title,
        question: req.body.question,
        createdAt: new Date(),
        votes: 0,
        views: 0,
        tags: req.body.tags || [],
        author: req.body.username || "Anonymous",
        url: url, // Encode the title to create the URL
      });

      // Save the new question to the database
      await newQuestion.save();

      res.redirect(`/questions/${url}`);
      
  } catch (error) {
      console.error('Error saving question:', error);
  }
});


// Edit question (WIP)
router.get('/questions/edit/:title', async (req, res) => {
  const isAuthenticated = req.isAuthenticated()
  res.render('newQuestion', {isAuthenticated: isAuthenticated});
});

// Delete question (WIP)
router.delete('/questions/:title', async (req, res) => {
  await Question.findByTitleAndDelete(req.params.title);
  res.redirect('/');
});

// Load existing question page
router.get('/questions/:url', async (req, res) => {
  try {
    // Find question from the database based on the title
    const question = await fetchQuestion(req.params.url);

    if (question && question.views !== null && question.views !== undefined) {
      question.views += 1; // Increase view count by one
    }

    await question.save();
    const timeSincePost = timeSince(question.createdAt);
    const isAuthenticated = {
      username: req.isAuthenticated() ? req.user.username : null,
      userID: req.isAuthenticated() ? req.user.id : null,
      value: req.isAuthenticated(),
    }

    // Render the 'question' template and pass data to it
    res.render('question', {question, timeSincePost, isAuthenticated});

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Get user's vote for the current question


// Handle vote updates
router.post('/questions/update/votes', async (req, res) => {
  const { voteCount, questionId } = req.body;
  try {

    // Find the question in the database by ID and update the votes
    const question = await Question.findByIdAndUpdate(
      questionId,
      { $set: { votes: voteCount } }, // Use $set to set the field to the specified value
      { new: true }
    );

    res.json({ success: true, question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

async function fetchQuestion(title) {
  try {
    const question = await Question.findOne({ title });
    return question;
  } catch (error) {
    return res.status(404).send('Question not found');
  }
}

// Get time difference between post and current time
function timeSince(date) {
  const currentDate = new Date();
  const pastDate = new Date(date);

  const years = currentDate.getFullYear() - pastDate.getFullYear();
  const months = currentDate.getMonth() - pastDate.getMonth();
  const days = currentDate.getDate() - pastDate.getDate();

  let result = '';

  if (years > 0) {
      result += `${years} ${years === 1 ? 'year' : 'years'}`;
  }

  if (months > 0) {
      result += `${result ? ', ' : ''}${months} ${months === 1 ? 'month' : 'months'}`;
  }

  if (days > 0) {
      result += `${result ? ', ' : ''}${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return result ? result + ' ago' : 'just now';
}

module.exports = router;