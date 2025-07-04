import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB from './db/db.js';
import cookieParser from 'cookie-parser';
import teacherRoutes from './routes/teacherRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import questionRoutes from './routes/questionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors({
  origin: [
    'https://papper-generator.onrender.com',
    'http://localhost:5173',
    'https://www.papper-generator.onrender.com',
    'capacitor://localhost', // for mobile apps
    'http://localhost', // for mobile browser
    'http://127.0.0.1',
    'https://127.0.0.1'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie']
}));
app.use(express.json());
app.use(cookieParser());

// Serve static files from frontend/public (for images, logos, etc.)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Serve static files from frontend/dist (for production React build)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Teacher routes
app.use('/school/teacher', teacherRoutes);
// Student routes
app.use('/school/student', studentRoutes);
// Question routes
app.use('/school/question', questionRoutes);

// Fallback for SPA (React Router)
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
