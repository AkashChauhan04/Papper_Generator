const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true }, // ensure unique index
  password: { type: String, required: true },
  currentJob: { type: String },
  currentSchool: { type: String },
  graduation: { type: String },
  postgraduation: { type: String },
  // Add other fields as needed
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

// Ensure unique index on email (run once in your DB):
// db.teachers.createIndex({ email: 1 }, { unique:  true })

module.exports = mongoose.model('Teacher', teacherSchema);
