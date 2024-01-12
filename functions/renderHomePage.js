const Question = require('../models/Question');

async function renderHomePage(req, res) {
  try {
    const questions = await Question.find().sort({ createdAt: 'desc' });
    const isAuthenticated = req.isAuthenticated()
    res.render('home', { questions, isAuthenticated});
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  renderHomePage
};