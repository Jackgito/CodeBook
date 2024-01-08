const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: false,
  },
  comment: {
    type: String,
    required: false,
  },
  votes: {
    type: Number,
    default: 0,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: false,
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
  votes: {
    type: Number,
    default: 0,
    required: false,
  },
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
});

module.exports = mongoose.model('Question', questionSchema);