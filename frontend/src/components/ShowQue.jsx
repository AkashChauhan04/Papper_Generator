import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowQue = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        // Get teacher id from localStorage (set after login)
        const teacherId = localStorage.getItem('teacherId');
        if (!teacherId) throw new Error('Teacher ID not found. Please log in again.');
        const res = await axios.get(`http://localhost:5000/school/question/teacher/${teacherId}`, {
          withCredentials: true,
        });
        setQuestions(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Error loading questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleEditClick = (q) => {
    setEditingId(q._id);
    setEditForm({ ...q });
    setEditError('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditOptionChange = (idx, value) => {
    const newOptions = [...editForm.options];
    newOptions[idx] = value;
    setEditForm({ ...editForm, options: newOptions });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const res = await axios.put(`http://localhost:5000/school/question/update/${editingId}`,
        {
          ...editForm,
          class: Number(editForm.class),
          marks: Number(editForm.marks),
        },
        { withCredentials: true }
      );
      setQuestions(questions.map(q => q._id === editingId ? res.data.question : q));
      setEditingId(null);
    } catch (err) {
      setEditError(err.response?.data?.message || err.message || 'Failed to update question');
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
    setEditError('');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10">
      <h2 className="text-3xl font-bold text-pink-700 mb-6 text-center">My Questions</h2>
      {loading && <div className="text-center text-pink-500">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && questions.length === 0 && (
        <div className="text-center text-gray-500">No questions found.</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questions.map((q) => (
          <div key={q._id} className="bg-white rounded-2xl shadow-lg border border-pink-100 p-6 flex flex-col gap-2">
            {editingId === q._id ? (
              <form onSubmit={handleEditSubmit} className="space-y-2">
                <input
                  name="text"
                  value={editForm.text}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded mb-1"
                  placeholder="Question Text"
                  required
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {editForm.options && editForm.options.map((opt, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={opt}
                      onChange={e => handleEditOptionChange(idx, e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder={`Option ${idx + 1}`}
                      required={idx < 2}
                    />
                  ))}
                </div>
                <input
                  name="image"
                  value={editForm.image || ''}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded mb-1"
                  placeholder="Image URL (optional)"
                />
                <input
                  name="class"
                  type="number"
                  min="1"
                  value={editForm.class}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded mb-1"
                  placeholder="Class"
                  required
                />
                <input
                  name="subject"
                  value={editForm.subject}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded mb-1"
                  placeholder="Subject"
                  required
                />
                <input
                  name="marks"
                  type="number"
                  min="1"
                  value={editForm.marks}
                  onChange={handleEditChange}
                  className="w-full p-2 border rounded mb-1"
                  placeholder="Marks"
                  required
                />
                {editError && <div className="text-red-500 text-sm text-center">{editError}</div>}
                <div className="flex gap-2 justify-end mt-2">
                  <button type="button" onClick={handleEditCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600" disabled={editLoading}>
                    {editLoading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-pink-700">Class {q.class} - {q.subject}</span>
                  <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-semibold">{q.marks} marks</span>
                </div>
                <div className="text-gray-800 font-medium mt-2">{q.text}</div>
                {q.image && (
                  <img src={q.image} alt="Question" className="w-full max-h-40 object-contain rounded-lg border mt-2" />
                )}
                <ul className="list-disc pl-6 mt-2">
                  {q.options && q.options.map((opt, idx) => (
                    <li key={idx} className="text-gray-700">{opt}</li>
                  ))}
                </ul>
                <button onClick={() => handleEditClick(q)} className="mt-3 px-4 py-2 bg-orange-400 text-white rounded hover:bg-orange-500 self-end">Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowQue;
