const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Question = require('../models/Question.js');

const ensureAuthenticated = require('./authentication').ensureAuthenticated;

// Save comments to the database
router.post('/questions/add/comment', async (req, res) => {
  try {
    const { comment, username, questionID } = req.body;
    console.log(req.body, questionID);

    // Find the question by ID
    const question = await Question.findById(questionID);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Add the comment to the comments array
    const newComment = {
      author: username,
      comment: comment,
    };
    question.comments.push(newComment);

    // Save the updated question
    await question.save();

    // Handle response
    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update the vote count for a comment
router.post('/comments/update/votes', async (req, res) => {
  const { currentVote, userID, questionID, commentID } = req.body;

  try {
    const question = await Question.findById(questionID);
    const comment = question.comments.id(commentID);

    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    // Check if the user has already voted for this comment
    const userVoteIndex = comment.voters.findIndex(vote => vote.userID === userID);

    if (userVoteIndex !== -1) {
      // User has already voted, update the existing vote
      const previousVoteValue = comment.voters[userVoteIndex].userVoteValue;
      console.log("Previous vote value: ", previousVoteValue);

      // Update the user's current vote value
      comment.voters[userVoteIndex].userVoteValue = currentVote;

      // Update totalVotes by subtracting the previous vote value
      // and adding the current vote value
      comment.totalVotes = comment.totalVotes - previousVoteValue + currentVote;
    } else {
      // User hasn't voted yet, add a new vote
      comment.voters.push({ userID: userID, userVoteValue: currentVote });

      // Update totalVotes by adding the current vote value
      comment.totalVotes += currentVote;
    }

    // Save the updated comment to the database
    await question.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Get user's vote value for a comment
router.post('/comments/get/vote', async (req, res) => {
  const { commentID, questionID, userID } = req.body;
  try {
    const question = await Question.findById(questionID);
    const comment = question.comments.id(commentID);

    // Assuming userID is the target user's ID
    const voteValue = comment.voters.find(voter => voter.userID === userID)?.userVoteValue;
    console.log("voteValue", voteValue)

    if (!voteValue) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    res.json({ success: true, voteValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.delete('/comments/delete/:questionID/:commentID', async (req, res) => {
  const { questionID, commentID } = req.params;

  try {
    // Find the question by ID
    const question = await Question.findById(questionID);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Find the index of the comment in the array
    const commentIndex = question.comments.findIndex(comment => comment._id == commentID);

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Remove the comment by splicing the array
    question.comments.splice(commentIndex, 1);

    // Save the updated question
    await question.save();

    // Respond with success
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
