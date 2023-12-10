const Question = require('../models/Question');

async function renderHomePage(req, res) {
  try {
    const posts = await Question.find().sort({ createdAt: 'desc' });
    const isAuthenticated = req.isAuthenticated()
    res.render('home', { posts, isAuthenticated});
  } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  renderHomePage
};