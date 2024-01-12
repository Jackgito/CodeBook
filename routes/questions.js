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
      const url = encodeURIComponent(req.body.questionTitle)
      // Create a new Question document
      const newQuestion = new Question({
        title: req.body.questionTitle,
        question: req.body.question,
        createdAt: new Date(),
        votes: [{ totalVotes: 0, voters: [] }],
        views: 0,
        tags: req.body.tags || [],
        author: req.body.username || "Anonymous",
        url: url,
      });

      // Save the new question to the database
      await newQuestion.save();

      res.redirect(`/questions/${url}`);
      
  } catch (error) {
      console.error('Error saving question:', error);
  }
});


// Load existing question page
router.get('/questions/:url', async (req, res) => {
  try {
    // Find question from the database based on the title
    const question = await fetchQuestion(req.params.url);

    // Increase view count by one
    if (question && question.views !== null && question.views !== undefined) {
      question.views += 1;
      await Question.updateOne(
        { _id: question._id },
        { $set: { views: question.views } }
      );
    }

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

// Get user's vote value for a question
router.post('/questions/get/vote', async (req, res) => {
  const { questionID, userID } = req.body;
  try {
    const question = await Question.findOne({ _id: questionID });
    const vote = question.voters.find(v => v.userID === userID);
    console.log(vote)

    if (vote) {
      res.status(200).json({ userVoteValue: vote.userVoteValue });
    } else {
      res.status(404).json({ error: 'Vote not found' });
    }
  } catch (error) {
    console.error('Error retrieving vote value:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle vote updates
router.post('/questions/update/votes', async (req, res) => {
  const { currentVote, userID, questionID } = req.body;

  try {
    // Find the question in the database by ID
    const question = await Question.findById(questionID);

    if (!question) {
      return res.status(404).json({ success: false, error: 'Question not found' });
    }

    // Check if the user has already voted for this question
    const userVoteIndex = question.voters.findIndex(vote => vote.userID === userID);

    if (userVoteIndex !== -1) {
      // User has already voted, update the existing vote
      const previousVoteValue = question.voters[userVoteIndex].userVoteValue;

      // Update the user's current vote value
      question.voters[userVoteIndex].userVoteValue = currentVote;

      // Update totalVotes by subtracting the previous vote value
      // and adding the current vote value
      question.totalVotes = question.totalVotes - previousVoteValue + currentVote;
    } else {
      // User hasn't voted yet, add a new vote
      question.voters.push({ userID: userID, userVoteValue: currentVote });

      // Update totalVotes by adding the current vote value
      question.totalVotes += currentVote;
    }

    // Save the updated question to the database
    await question.save();

    res.json({ success: true, question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


// Delete question 
router.delete('/questions/delete/:questionID', async (req, res) => {
  const questionID = req.params.questionID;

  // Find the question by ID and delete it
  Question.findByIdAndDelete(questionID)
    .then(() => {
      console.log('Question deleted!');
      res.redirect('/');
    })
    .catch(err => {
      console.error('Error deleting question', err);
      res.status(500).send('Error deleting question');
    });
});

// Edit question
router.get('/questions/edit/:questionID', ensureAuthenticated, async (req, res) => {
  const question = await Question.findById(req.params.questionID);
  if (!question) {
    return res.redirect('/');
  }
  res.render('editQuestion', {
    isAuthenticated: {
      user: req.isAuthenticated() ? req.user.username : null,
      value: req.isAuthenticated(),
    },
    question: question
  });
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
  const months = (currentDate.getMonth() - pastDate.getMonth()) + (years * 12);
  const days = currentDate.getDate() - pastDate.getDate();

  let result = '';

  if (months > 0) {
      result += `${months} ${months === 1 ? 'month' : 'months'}`;
  }

  if (days > 0) {
      result += `${result ? ', ' : ''}${days} ${days === 1 ? 'day' : 'days'}`;
  }

  return result ? result + ' ago' : 'today';
}


module.exports = router;