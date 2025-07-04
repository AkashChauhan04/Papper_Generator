const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true }, // ensure unique index
  password: { type: String, required: true },
  // Add more fields as needed (e.g., class, roll number, etc.)
});

// Ensure unique index on email (run once in your DB):
// db.students.createIndex({ email: 1 }, { unique: true })

module.exports = mongoose.model('Student', studentSchema);
