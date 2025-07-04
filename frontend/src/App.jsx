import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import TeacherLogin from './pages/TeacherLogin'
import StudentLogin from './pages/StudentLogin'
import TeacherSignin from './pages/TeacherSignin'
import StudentSignin from './pages/StudentSignin'
import Navbar from './components/Navbar'
import Home from './components/Home'
import AddQue from './components/AddQue'
import ShowQue from './components/ShowQue'
import GeneratePapper from './components/GeneratePapper'
import StudentHome from './components/StudentHome'

const App = () => {
  // Simulate login state (replace with real auth logic)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState('') // 'teacher' or 'student'

  // Pass setIsLoggedIn and setUserType to login pages
  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <Routes>
        <Route path="/" element={
          isLoggedIn
            ? userType === 'teacher'
              ? <Home />
              : <StudentHome />
            : <StudentLogin setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />
        } />
        <Route path="/teacher/login" element={<TeacherLogin setIsLoggedIn={setIsLoggedIn} setUserType={setUserType} />} />
        <Route path="/teacher/signin" element={<TeacherSignin />} />
        <Route path="/student/signin" element={<StudentSignin />} />
        <Route path="/add-question" element={isLoggedIn && userType === 'teacher' ? <AddQue /> : <Navigate to="/" />} />
        <Route path="/show-questions" element={isLoggedIn && userType === 'teacher' ? <ShowQue /> : <Navigate to="/" />} />
        <Route path="/generate-paper" element={isLoggedIn && userType === 'teacher' ? <GeneratePapper /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
