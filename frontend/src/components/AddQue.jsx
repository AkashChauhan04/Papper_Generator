import React, { useState } from 'react';
import axios from 'axios';

const initialState = {
  text: '',
  options: ['', '', '', ''],
  image: '',
  class: '',
  subject: '',
  marks: '',
};

const AddQue = () => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setSuccess('');
  };

  const handleOptionChange = (idx, value) => {
    const newOptions = [...form.options];
    newOptions[idx] = value;
    setForm({ ...form, options: newOptions });
    setSuccess('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.text.trim()) newErrors.text = 'Question text is required';
    if (!form.class) newErrors.class = 'Class is required';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.marks) newErrors.marks = 'Marks are required';
    // No options required
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    setSuccess('');
    if (Object.keys(newErrors).length > 0) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        class: Number(form.class),
        marks: Number(form.marks),
        options: showOptions ? form.options.filter(opt => opt.trim()) : [],
      };
      const res = await axios.post('https://papper-generator.onrender.com/school/question/createquestion', payload, { withCredentials: true });
      setSuccess('Question submitted successfully!');
      setForm(initialState);
      setShowOptions(false);
    } catch (err) {
      setErrors({ api: err.response?.data?.message || err.message || 'Failed to submit question' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 mt-10 border border-pink-100">
      <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">Add New Question</h2>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block font-semibold text-pink-700 mb-1">Question Text</label>
          <textarea
            name="text"
            value={form.text}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.text ? 'border-red-400' : 'border-pink-200'}`}
            placeholder="Enter the question text"
            rows={3}
          />
          {errors.text && <span className="text-red-500 text-xs">{errors.text}</span>}
        </div>
        <div>
          <label className="block font-semibold text-pink-700 mb-1">Do you want options?</label>
          <div className="flex gap-4 items-center mt-1">
            <label className="flex items-center gap-1">
              <input type="radio" name="hasOptions" checked={showOptions} onChange={() => setShowOptions(true)} /> Yes
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="hasOptions" checked={!showOptions} onChange={() => setShowOptions(false)} /> No
            </label>
          </div>
        </div>
        {showOptions && (
          <div>
            <label className="block font-semibold text-pink-700 mb-1">Options (up to 4)</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {form.options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white"
                  placeholder={`Option ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block font-semibold text-pink-700 mb-1">Image (URL or Path)</label>
          <input
            name="image"
            type="text"
            value={form.image}
            onChange={handleChange}
            className="w-full p-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white"
            placeholder="Paste image URL or path (optional)"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-pink-700 mb-1">Class</label>
            <input
              name="class"
              type="number"
              min="1"
              value={form.class}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.class ? 'border-red-400' : 'border-pink-200'}`}
              placeholder="Class"
            />
            {errors.class && <span className="text-red-500 text-xs">{errors.class}</span>}
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">Subject</label>
            <input
              name="subject"
              type="text"
              value={form.subject}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.subject ? 'border-red-400' : 'border-pink-200'}`}
              placeholder="Subject"
            />
            {errors.subject && <span className="text-red-500 text-xs">{errors.subject}</span>}
          </div>
          <div>
            <label className="block font-semibold text-pink-700 mb-1">Marks</label>
            <input
              name="marks"
              type="number"
              min="1"
              value={form.marks}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition bg-white ${errors.marks ? 'border-red-400' : 'border-pink-200'}`}
              placeholder="Marks"
            />
            {errors.marks && <span className="text-red-500 text-xs">{errors.marks}</span>}
          </div>
        </div>
        {errors.api && <div className="text-center text-red-500">{errors.api}</div>}
        {success && <div className="text-center text-green-600 font-semibold">{success}</div>}
        <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-lg font-bold shadow hover:scale-105 transition-transform mt-4" disabled={loading}>
          {loading ? 'Submitting...' : 'Add Question'}
        </button>
      </form>
    </div>
  );
};

export default AddQue;
