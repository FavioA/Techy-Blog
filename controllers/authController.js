const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Render the signup form
router.get('/signup', authController.renderSignup);

// Handle user signup
router.post('/signup', authController.signup);

// Render the login form
router.get('/login', authController.renderLogin);

// Handle user login
router.post('/login', authController.login);

// Handle user logout
router.get('/logout', authController.logout);

module.exports = router;
