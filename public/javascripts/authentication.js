const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

module.exports = (passport) => {
  // Passport initialization

  // Register
  router.post('/signUp', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      await newUser.save();
      res.redirect('/login');
    } catch (error) {
      console.error('Error creating user:', error);
      res.redirect('/signUp');
    }
  });

  // Login
  router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }));

  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  return router;
};



// async function register() {
//   const regUsername = document.getElementById('regUsername').value;
//   const regPassword = document.getElementById('regPassword').value;

//   const response = await fetch('/api/user/register', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username: regUsername, password: regPassword }),
//   });

//   const result = await response.json();
//   showMessage(response.status, result.error || 'Registration successful!');
// }

// async function login() {
//   const loginUsername = document.getElementById('loginUsername').value;
//   const loginPassword = document.getElementById('loginPassword').value;

//   const response = await fetch('/api/user/login', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({ username: loginUsername, password: loginPassword }),
//   });

//   const result = await response.json();

//   if (response.status === 200) {
//     // Successful login
//     showMessage(response.status, 'Login successful!');
//     document.getElementById('registrationForm').style.display = 'none';
//     document.getElementById('loginForm').style.display = 'none';
//     document.querySelector('.logout').style.display = 'block';
//   } else {
//     // Failed login
//     showMessage(response.status, result.error || 'Login failed');
//   }
// }

// async function logout() {
//   const response = await fetch('/api/user/logout', {
//     method: 'POST',
//   });

//   const result = await response.json();

//   if (response.status === 200) {
//     // Successful logout
//     showMessage(response.status, 'Logout successful!');
//     document.getElementById('registrationForm').style.display = 'block';
//     document.getElementById('loginForm').style.display = 'block';
//     document.querySelector('.logout').style.display = 'none';
//   } else {
//     // Failed logout
//     showMessage(response.status, result.error || 'Logout failed');
//   }
// }

// function showMessage(status, message) {
//   const messageDiv = document.getElementById('message');
//   messageDiv.innerHTML = `<p style="color: ${status === 200 ? 'green' : 'red'}">${message}</p>`;
//   setTimeout(() => {
//     messageDiv.innerHTML = '';
//   }, 3000);
// }
