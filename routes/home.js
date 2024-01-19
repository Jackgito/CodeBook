const Question = require('../models/Question');

// Render home page question page
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: 'desc' });
    const isAuthenticated = req.isAuthenticated()
    const darkMode = req.cookies.darkMode;
    res.render('home', { questions, isAuthenticated});
    } catch (error) {
    console.error('Error rendering home page:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
