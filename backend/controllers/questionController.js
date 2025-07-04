const Question = require('../models/Question');


// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    // Use teacher id from req.user (set by auth middleware)
    const teacherId = req.user.id;
    const { text, options, image, class: classNum, subject, marks } = req.body;

    // Ensure options is always an array (can be empty)
    const safeOptions = Array.isArray(options) ? options.filter(opt => typeof opt === 'string') : [];

    const question = new Question({
      text,
      options: safeOptions, // allow 0-4 options
      image,
      class: Number(classNum),
      subject,
      marks,
      teacher: teacherId
    });
    await question.save();
    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all questions for a teacher
exports.getQuestionsByTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;
    if (!teacherId) return res.status(400).json({ message: 'Teacher ID is required' });
    const questions = await Question.find({ teacher: teacherId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all questions for the logged-in teacher
exports.getQuestionsByLoggedInTeacher = async (req, res) => {
  try {
    console.log('req.user:', req.user); // Debug: log JWT payload
    const teacherId = req.user.id || req.user._id;
    if (!teacherId) return res.status(401).json({ message: 'No teacher id in token' });
    const questions = await Question.find({ teacher: teacherId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// // Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.class !== undefined) {
      updates.class = Number(updates.class);
    }
    const question = await Question.findByIdAndUpdate(id, updates, { new: true });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question updated', question });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByIdAndDelete(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Generate question paper
exports.generatePaper = async (req, res) => {
  try {
    const { teacherId, totalMarks, totalQuestions, marksDistribution, class: classNum, subject } = req.body;
    // marksDistribution: { '1': 5, '2': 3, '5': 1, '10': 1 }
    const allowedMarks = [1, 2, 5, 10];
    let allQuestions = [];
    let sumMarks = 0;
    let sumQuestions = 0;
    let grouped = {};

    for (const mark of allowedMarks) {
      const count = marksDistribution[mark] || 0;
      if (count > 0) {
        const questions = await Question.aggregate([
          { $match: { teacher: teacherId, marks: mark, class: Number(classNum), subject } },
          { $sample: { size: count } }
        ]);
        if (questions.length < count) {
          return res.status(400).json({ message: `Not enough ${mark}-mark questions for teacher in class ${classNum} and subject ${subject}.` });
        }
        grouped[mark] = questions;
        allQuestions = allQuestions.concat(questions);
        sumMarks += mark * count;
        sumQuestions += count;
      }
    }

    if (sumMarks !== totalMarks || sumQuestions !== totalQuestions) {
      return res.status(400).json({ message: 'Sum of marks or questions does not match the request.' });
    }

    res.json({ groupedQuestions: grouped, allQuestions });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
