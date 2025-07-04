const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new student
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hashedPassword });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login student
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // always true for cross-device/mobile
      sameSite: 'None', // allow cross-site cookies
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).json({ message: 'Login successful', student: { id: student._id, name: student.name, email: student.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Logout student (client should handle token removal)
exports.logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logout successful' });
};
