const Teacher = require('../models/Teacher');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new teacher
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const teacher = new Teacher({ name, email, password: hashedPassword });
    await teacher.save();
    res.status(201).json({ message: 'Teacher registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login teacher
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).json({ message: 'Login successful', teacher: { id: teacher._id, name: teacher.name, email: teacher.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Logout teacher (client should handle token removal)
exports.logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logout successful' });
};

// Update teacher profile
exports.updateProfile = async (req, res) => {
  try {
    const teacherId = req.user.id; // req.user should be set by auth middleware
    const { currentJob, currentSchool, graduation, postgraduation  } = req.body;
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { currentJob, currentSchool, graduation, postgraduation },
      { new: true }
    );
    res.json({ message: 'Profile updated', teacher: updatedTeacher });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
