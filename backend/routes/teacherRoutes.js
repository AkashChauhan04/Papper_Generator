const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');

// Teacher registration
router.post('/register', teacherController.register);
// Teacher login
router.post('/login', teacherController.login)
// Teacher logout
router.post('/logout', teacherController.logout);
// Teacher profile update (protected route, add auth middleware as needed)
router.put('/profile', teacherController.updateProfile);

module.exports = router;
