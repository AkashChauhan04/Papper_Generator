const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Student registration
router.post('/register', studentController.register);
// Student login
router.post('/login', studentController.login);
// Student logout
router.post('/logout', studentController.logout);

module.exports = router;
