const express = require('express');
const router = express.Router();

router.get('/profile', async (req, res) => {
  try {
    const user = req.user;
    res.render('profile', { user });
  } catch (error) {
    console.error('Error rendering profile page:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;