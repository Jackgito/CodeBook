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
  res.render('newQuestion');
});

// Edit question (WIP)
router.get('/questions/edit/:id', async (req, res) => {
    const question = await Question.findById(req.params.id)
    res.render('questions/edit', { question: question })
});

// Render existing question page
router.get('/questions/:url', async (req, res) => {
  try {
    const url = encodeURIComponent(req.params.url); // For some reason the url needs to be encoded again
    // Find the question with the matching decoded URL in your MongoDB collection
    const question = await Question.findOne({ url: url });

    if (!question) {
      return res.status(404).send('Question not found');
    }

    // Render the 'question' template and pass data to it
    res.render('question', {
      title: question.title,
      question: question.question,
      author: question.author,
      tags: question.tags,
      views: question.views,
      votes: question.votes,
      comments: question.comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Save a new question
router.post('/questions/:id', async (req, res) => {
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

        // Redirect to /questions/:id with the formatted title if save is successful
        res.redirect(`/questions/${formattedTitle}`);
    } catch (error) {
        console.error('Error saving question:', error);
    }
});

router.delete('/questions/:id', async (req, res) => {
    await Question.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

module.exports = router;
