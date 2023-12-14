const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  questionID: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  userVote: { type: Number, enum: [-1, 1], required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  votes: { type: [voteSchema], required: false },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
