import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import axios from 'axios'

const API_BASE = import.meta.env.MODE === 'production'
  ? 'https://papper-generator.onrender.com'
  : 'http://localhost:5000'

const TeacherSignin = () => {
  const formRef = useRef()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    gsap.from(formRef.current, { y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
  }, [])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
    setServerError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const newErrors = {}
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = 'Required'
    })
    setErrors(newErrors)
    setServerError('')
    if (Object.keys(newErrors).length > 0) return
    setLoading(true)
    try {
      const res = await axios.post(
        `${API_BASE}/school/teacher/register`,
        form,
        { withCredentials: true }
      )
      navigate('/teacher/login')
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100">
      <div ref={formRef} className="w-full max-w-md p-8 bg-white/95 rounded-2xl shadow-2xl border border-pink-200 animate-fadeIn">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-pink-700 tracking-wide">Teacher Sign Up</h2>
        {serverError && <div className="mb-4 text-red-500 text-center text-sm font-semibold">{serverError}</div>}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          {errors.general && <div className="text-red-500 text-sm text-center mb-2">{errors.general}</div>}
          <div>
            <label className="block mb-1 font-semibold text-pink-700">Name</label>
            <input name="name" type="text" value={form.name} onChange={handleChange} inputMode="text" autoComplete="name" className={`w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.name ? 'border-red-400' : ''}`} placeholder="Enter your name" disabled={loading} />
            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pink-700">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} inputMode="email" autoComplete="email" className={`w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.email ? 'border-red-400' : ''}`} placeholder="Enter your email" disabled={loading} />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-pink-700">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} inputMode="text" autoComplete="new-password" className={`w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.password ? 'border-red-400' : ''}`} placeholder="Enter your password" disabled={loading} />
            {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
          </div>
          <button type="submit" className="w-full py-3 mt-2 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-lg transition disabled:opacity-60" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/teacher/login" className="text-pink-600 hover:underline font-semibold">Login</Link>
        </div>
      </div>
    </div>
  )
}

export default TeacherSignin
