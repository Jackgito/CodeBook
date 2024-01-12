const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  voters: [{
    userID: String,
    userVoteValue: { type: Number, enum: [-1, 0, 1] }
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  totalVotes: {
    type: Number,
    default: 0
  },
});

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: false,
  },
  voters: [{
    userID: String,
    userVoteValue: { type: Number, enum: [-1, 0, 1] }
  }],
  views: {
    type: Number,
    default: 0,
    required: false,
  },
  tags: {
    type: [String],
    required: false,
  },
  author: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  comments: {
    type: [commentSchema],
    required: false,
  },
  totalVotes: {
    type: Number,
    default: 0
  },
});

module.exports = mongoose.model('Question', questionSchema);
