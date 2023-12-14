const express = require('express');
const router = express.Router();
const User = require('../models/User');


const ensureAuthenticated = require('./authentication').ensureAuthenticated;

router.post('/users/get/vote', async (req, res) => {
  const { questionID, userID } = req.body;
  console.log("!!!!!!!", req.body)
  try {


    if (!questionID || !userID) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Find the user by userID
    const user = await User.findOne({ _id: userID }); // Update to use userID

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find the vote for the specified questionID
    const vote = user.votes.find(vote => vote.questionID.equals(questionID));

    if (vote) {
      // Return the vote value
      res.status(200).json({ userVote: vote.userVote });
    } else {
      // Handle the case where the vote is not found
      res.status(404).json({ error: 'Vote not found' });
    }

  } catch (error) {
    console.error('Error retrieving vote value:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/users/update/vote', async (req, res) => {
  const userID = req.body.userID;
  const vote = req.body.votes;
  console.log("Vote:", vote, "User ID: ", userID);

  try {
    // Find the user by ID
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Make sure user.votes is an array
    user.votes = user.votes || [];

    // Find the vote for the specified questionID
    const existingVoteIndex = user.votes.findIndex(v => v.questionID.equals(vote.questionID));

    if (existingVoteIndex !== -1) {
      // Update existing vote
      user.votes[existingVoteIndex].userVote = vote.userVote;
    } else {
      // Create a new vote entry
      user.votes.push({ questionID: vote.questionID, userVote: vote.userVote });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: 'Vote updated successfully' });
  } catch (error) {
    console.error('Error updating vote:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
