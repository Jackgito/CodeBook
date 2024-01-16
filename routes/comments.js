const express = require('express');
const router = express.Router();
const Question = require('../models/Question.js');

// Save comments to the database
router.post('/questions/add/comment', async (req, res) => {
  try {
    const { comment, username, questionID } = req.body;
    console.log(req.body, questionID);

    const question = await Question.findById(questionID);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const newComment = {
      author: username,
      comment: comment,
    };
    question.comments.push(newComment);

    await question.save();

    // Handle response
    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update vote count for a comment
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
      
      comment.voters[userVoteIndex].userVoteValue = currentVote;

      // Update totalVotes by subtracting the previous vote value
      // and adding the current vote value
      comment.totalVotes = comment.totalVotes - previousVoteValue + currentVote;
    } else {
      // User hasn't voted yet, add a new vote and update totalVotes
      comment.voters.push({ userID: userID, userVoteValue: currentVote });
      comment.totalVotes += currentVote;
    }

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
    const voteValue = comment.voters.find(voter => voter.userID === userID)?.userVoteValue;

    if (!voteValue) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    res.json({ success: true, voteValue });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Delete comment
router.delete('/comments/delete/:questionID/:commentID', async (req, res) => {
  const { questionID, commentID } = req.params;

  try {
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

    await question.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle comment update
router.post('/comments/update/comment', async (req, res) => {
  try {
    const { comment, questionID, commentID } = req.body;

    // Find the question by ID
    const question = await Question.findById(questionID);

    // Find the index of the comment in the comments array
    const commentIndex = question.comments.findIndex(c => c._id.toString() === commentID);

    // Update the specific comment
    question.comments[commentIndex].comment = comment;

    // Save the updated question to the database
    const updatedQuestion = await question.save();

    res.json({ success: true, updatedQuestion });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get total votes for a comment
router.post('/comments/get/totalVotes', async (req, res) => {
  const { commentID, questionID } = req.body;
  try {
    const question = await Question.findById(questionID);
    const comment = question.comments.id(commentID);
    console.log(comment.totalVotes);
    res.json({ success: true, totalVotes: comment.totalVotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});


module.exports = router;
