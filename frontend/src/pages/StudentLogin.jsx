import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import axios from 'axios'

const API_BASE = import.meta.env.MODE === 'production'
  ? 'https://papper-generator.onrender.com'
  : 'http://localhost:5000'

const StudentLogin = () => {
  const formRef = useRef()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    gsap.from(formRef.current, { y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
  }, [])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setApiError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = {}
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = 'Required'
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    setLoading(true)
    try {
      const res = await axios.post(
        `${API_BASE}/school/student/login`,
        form,
        { withCredentials: true }
      )
      // Save studentId or token if needed
      localStorage.setItem('studentId', res.data.student?._id)
      navigate('/student/home')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100">
      <div ref={formRef} className="w-full max-w-md p-8 bg-white/95 rounded-2xl shadow-2xl border border-pink-200 animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-700 tracking-wide">Student Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block mb-1 font-semibold text-pink-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className={`w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.email ? 'border-red-400' : ''}`} placeholder="Enter your email" />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pink-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className={`w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.password ? 'border-red-400' : ''}`} placeholder="Enter your password" />
            {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
          </div>
          {apiError && <div className="text-center text-red-500 text-sm">{apiError}</div>}
          <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-lg font-bold shadow hover:scale-105 transition-transform" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="flex flex-col items-center mt-6">
          <span className="text-gray-700">New here? <Link to="/student/signin" className="text-pink-600 font-semibold hover:underline">Create new account</Link></span>
          <button className="mt-4 text-sm text-orange-500 underline hover:text-orange-700 transition" onClick={() => navigate('/teacher/login')}>Log in as Teacher</button>
        </div>
      </div>
    </div>
  )
}

export default StudentLogin
