const Question = require('../models/Question');

async function renderQuestionPage(req, res, title) {
    try {
      const post = await Question.findOne({ title: title });
      const isAuthenticated = req.isAuthenticated()
      res.render('question', { post, isAuthenticated});
    } catch (error) {
      console.error('Error rendering home page:', error);
      res.status(500).send('Internal Server Error');
    }
  }

module.exports = {
    renderQuestionPage
};