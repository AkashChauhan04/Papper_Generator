const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const auth = require('../middleware/auth');

// Create a new question (protected)
router.post('/createquestion', auth, questionController.createQuestion);
// Get all questions for a teacher (protected, by id from URL)
router.get('/teacher/:teacherId', auth, questionController.getQuestionsByTeacher);
// Get a single question by ID (protected)
router.get('/:id', auth, questionController.getQuestionById);
// Update a question (protected)
router.put('/update', auth, questionController.updateQuestion);
// Delete a question (protected)
router.delete('/delete/:id', auth, questionController.deleteQuestion);
// Generate question paper (protected)
router.post('/generatepaper', auth, questionController.generatePaper);

module.exports = router;
