import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SCHOOL_NAME = 'Your School Name'; // Change as needed
const LOGO_URL = '/serva.webp'; // Place your logo image in public folder as serva.webp

const GeneratePapper = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const paperRef = useRef();

  // For header info
  const [header, setHeader] = useState({
    class: '',
    subject: '',
    date: '',
    time: '',
    maxMarks: '',
    schoolName: SCHOOL_NAME,
    affiliated: '',
    address: '',
  });

  const handleHeaderChange = (e) => {
    setHeader({ ...header, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setQuestions([]);
    try {
      const teacherId = localStorage.getItem('teacherId');
      if (!teacherId) throw new Error('Teacher ID not found. Please log in again.');
      const res = await fetch(`http://localhost:5000/school/question/teacher/${teacherId}`, {
        method: 'GET',
        credentials: 'include',
      });
      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        throw new Error('Server returned invalid JSON.');
      }
      if (!res.ok) throw new Error(data.message || 'Failed to fetch questions');
      setQuestions(data);
    } catch (err) {
      setError(err.message || 'Error fetching questions');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const input = paperRef.current;
    // Add watermark before rendering
    const watermark = document.createElement('div');
    watermark.innerText = (header.schoolName || SCHOOL_NAME) + ' - CONFIDENTIAL';
    watermark.style.position = 'absolute';
    watermark.style.top = '50%';
    watermark.style.left = '50%';
    watermark.style.transform = 'translate(-50%, -50%)';
    watermark.style.fontSize = '60px';
    watermark.style.color = 'rgba(200,200,200,0.15)';
    watermark.style.fontWeight = 'bold';
    watermark.style.pointerEvents = 'none';
    watermark.style.zIndex = '1';
    watermark.style.whiteSpace = 'nowrap';
    input.appendChild(watermark);
    // Wait for DOM update
    await new Promise(r => setTimeout(r, 100));
    const canvas = await html2canvas(input, { scale: 2, useCORS: true, backgroundColor: '#fff' });
    input.removeChild(watermark);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    let position = 0;
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    if (pdfHeight > pageHeight) {
      let heightLeft = pdfHeight - pageHeight;
      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
    }
    pdf.save('question-paper.pdf');
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 sm:p-8 mt-6 sm:mt-10 border border-pink-100">
      <h2 className="text-2xl sm:text-3xl font-bold text-pink-700 mb-4 sm:mb-6 text-center">Generate Question Paper</h2>
      <form className="space-y-5" onSubmit={handleGenerate}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <input type="text" name="schoolName" value={header.schoolName} onChange={handleHeaderChange} placeholder="School Name" className="border rounded px-3 py-2 w-full" />
          <input type="text" name="affiliated" value={header.affiliated} onChange={handleHeaderChange} placeholder="Affiliated to" className="border rounded px-3 py-2 w-full" />
          <input type="text" name="address" value={header.address} onChange={handleHeaderChange} placeholder="Address" className="border rounded px-3 py-2 w-full" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <input type="text" name="class" value={header.class} onChange={handleHeaderChange} placeholder="Class" className="border rounded px-3 py-2 w-full" />
          <input type="text" name="subject" value={header.subject} onChange={handleHeaderChange} placeholder="Subject" className="border rounded px-3 py-2 w-full" />
          <input type="text" name="date" value={header.date} onChange={handleHeaderChange} placeholder="Date" className="border rounded px-3 py-2 w-full" />
          <input type="text" name="time" value={header.time} onChange={handleHeaderChange} placeholder="Time" className="border rounded px-3 py-2 w-full" />
          <input type="text" name="maxMarks" value={header.maxMarks} onChange={handleHeaderChange} placeholder="Max Marks" className="border rounded px-3 py-2 w-full" />
        </div>
        <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-lg font-bold shadow hover:scale-105 transition-transform mt-2 sm:mt-4" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Paper'}
        </button>
        {error && <div className="text-center text-red-500 mt-2">{error}</div>}
      </form>
      {questions.length > 0 && (
        <div className="mt-6 sm:mt-8">
          <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-2">All Questions (A4 Sheet)</h3>
          <div
            ref={paperRef}
            className="bg-white rounded-lg p-2 sm:p-8 shadow border relative overflow-x-auto"
            style={{
              width: '794px', // A4 width at 96dpi
              minHeight: '1122px', // A4 height at 96dpi
              maxWidth: '100%',
              fontFamily: 'serif',
              background: '#fff',
              color: '#222',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'visible', // allow logo and watermark
            }}
          >
            {/* Header Row */}
            <div className="flex flex-col sm:flex-row items-center mb-2 sm:mb-4" style={{position: 'relative', zIndex: 2}}>
              {/* Logo */}
              <img src={LOGO_URL} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-0 sm:mr-6" style={{zIndex: 2, position: 'relative', objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.10))'}} crossOrigin="anonymous" />
              {/* School Name */}
              <div className="flex-1 text-center">
                <div className="font-bold text-xl sm:text-3xl tracking-wide">{header.schoolName || SCHOOL_NAME}</div>
                <div className="text-sm sm:text-base mt-1">{header.affiliated || 'Affiliated to ...'} | {header.address || 'Address ...'}</div>
              </div>
              {/* Empty right for symmetry */}
              <div className="hidden sm:block" style={{ width: 104 }}></div>
            </div>
            {/* Info Row */}
            <div className="flex flex-wrap justify-between text-xs sm:text-base mb-2 sm:mb-4 mt-2 sm:mt-4 gap-y-1">
              <div>Class: <span className="font-semibold">{header.class || '__________'}</span></div>
              <div>Subject: <span className="font-semibold">{header.subject || '__________'}</span></div>
              <div>Date: <span className="font-semibold">{header.date || '__________'}</span></div>
              <div>Time: <span className="font-semibold">{header.time || '__________'}</span></div>
              <div>Max Marks: <span className="font-semibold">{header.maxMarks || '__________'}</span></div>
            </div>
            {/* Horizontal line */}
            <hr className="border border-gray-700 my-2 sm:my-4" />
            {/* Paper Title */}
            <div className="text-center text-lg sm:text-2xl font-bold mb-4 sm:mb-8 tracking-wide">QUESTION PAPER</div>
            {/* Questions */}
            <ol className="list-decimal pl-4 sm:pl-8 mt-4 sm:mt-8 text-base sm:text-lg">
              {questions.map((q, idx) => (
                <li key={q._id || idx} className="mb-4 sm:mb-6 relative pr-20 sm:pr-32 min-h-[40px]">
                  <span className="font-semibold text-gray-800">{q.text}</span>
                  {/* Marks on right */}
                  <span className="absolute right-0 top-0 font-bold text-pink-700 text-base sm:text-lg">{q.marks} marks</span>
                  {q.options && (
                    <ul className="list-disc pl-6 sm:pl-8 text-xs sm:text-sm text-gray-600 mt-1 ml-2">
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  )}
                  {q.image && (
                    <img src={q.image} alt="Question" className="w-24 h-16 sm:w-32 sm:h-20 object-contain rounded border mt-2" />
                  )}
                  <div className="text-xs text-gray-500 mt-1">Class: {q.class} | Subject: {q.subject}</div>
                </li>
              ))}
            </ol>
          </div>
          <button onClick={handleDownloadPDF} className="mt-4 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Download as PDF</button>
        </div>
      )}
    </div>
  );
};

export default GeneratePapper;
