const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentJob: { type: String },
  currentSchool: { type: String },
  graduation: { type: String },
  postgraduation: { type: String },
  // Add other fields as needed
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

module.exports = mongoose.model('Teacher', teacherSchema);
