const express = require("express");
const passport = require('passport');
const session = require('express-session');
const Question = require("../models/Question")
const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

const ensureAuthenticated = require('./authentication').ensureAuthenticated;

// Ask new question
router.get('/questions/new/question', ensureAuthenticated, (req, res) => {
  const isAuthenticated = req.isAuthenticated()
  res.render('newQuestion', {isAuthenticated: isAuthenticated});
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

// Render existing question page
router.get('/questions/:title', async (req, res) => {
  let isAuthenticated = req.isAuthenticated()

  try {
    // Find question from the database based on the title
    const question = await fetchQuestion(req.params.title)
    question.views += 1; // Increase view count by one
    await question.save();
    timeSincePost = timeSince(question.createdAt)

    // Render the 'question' template and pass data to it
    res.render('question', {
      title: question.title,
      question: question.question,
      author: question.author,
      tags: question.tags,
      views: question.views,
      votes: question.votes,
      comments: question.comments,
      isAuthenticated: isAuthenticated,
      timeSincePost: timeSincePost,
      questionObject: question
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Save a new question
router.post('/questions/:title', async (req, res) => {
    try {
        // Create a new Question instance
        const newQuestion = new Question({
            title: req.body.title,
            question: req.body.question,
            createdAt: new Date(), // Placeholder for createdAt
            votes: 0, // Placeholder for votes
            views: 0, // Placeholder for views
            tags: req.body.tags || [], // Use provided tags or an empty array as a placeholder
            author: req.body.author || "Anonymous", // Use provided author or "Anonymous" as a placeholder
            comments: [], // Placeholder for comments
            url: encodeURIComponent(req.body.title) // Encode the title to create the URL
        });

        // Save the new question to the database
        await newQuestion.save();

        // Construct the formatted title for redirection
        const formattedTitle = encodeURIComponent(req.body.title);

        // Redirect to /questions/:title with the formatted title if save is successful
        res.redirect(`/questions/${formattedTitle}`);
    } catch (error) {
        console.error('Error saving question:', error);
    }
});

// Define a route to handle vote updates
router.post('/updateVotes', async (req, res) => {
  try {
    const { questionId, voteValue } = req.body;

    // Find the question in the database by ID and update the votes
    const question = await Question.findByIdAndUpdate(questionId, { $inc: { votes: voteValue } }, { new: true });

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
