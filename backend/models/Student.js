const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add more fields as needed (e.g., class, roll number, etc.)
});

module.exports = mongoose.model('Student', studentSchema);
