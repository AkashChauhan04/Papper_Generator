const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String }],
  image: { type: String }, // store image URL or path
  class: { type: Number, required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
});

module.exports = mongoose.model('Question', questionSchema);
