import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import Toast from '../components/UI/Toast';
import api from '../utils/api';
import '../styles/InterviewPage.css';

const InterviewPage = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    fetchQuestions();
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(timer);
  }, [category]);

  const fetchQuestions = async () => {
    try {
      const res = await api.get(`/questions/${category}`);
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to load questions.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (e) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: e.target.value }));
  };

  const handleNext = () => {
    if (!answers[currentIndex]?.trim()) {
      setToast({ message: 'Please write an answer before moving to the next question.', type: 'warning' }); return;
    }
    setCurrentIndex(prev => prev + 1);
  };

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = async () => {
    const unanswered = questions.filter((_, i) => !answers[i]?.trim());
    if (unanswered.length > 0) {
      const confirmed = window.confirm(`You have ${unanswered.length} unanswered question(s). Submit anyway?`);
      if (!confirmed) return;
    }
    setSubmitting(true);
    try {
      const duration = Math.floor((Date.now() - startTime) / 60000);
      const formattedAnswers = questions.map((q, i) => ({
        question: q,
        userAnswer: answers[i] || ''
      }));
      const res = await api.post('/interviews/submit', {
        category,
        answers: formattedAnswers,
        duration
      });
      if (res.data.success) {
        navigate(`/results/${res.data.interview._id}`, { state: { evaluationMode: res.data.evaluationMode } });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Submission failed. Please try again.', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const answeredCount = Object.values(answers).filter(a => a?.trim()).length;

  if (loading) return <Layout><LoadingSpinner text="Loading interview questions..." /></Layout>;

  if (questions.length === 0) return (
    <Layout>
      <div className="interview-error">
        <div className="error-icon">⚠️</div>
        <h2>No Questions Found</h2>
        <p>Could not load questions for {category}. Please seed the database first.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={fetchQuestions} className="btn-back" style={{ background: '#2563eb' }}>🔄 Try Again</button>
          <button onClick={() => navigate('/categories')} className="btn-back" style={{ background: '#64748b' }}>Go Back</button>
        </div>
      </div>
    </Layout>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <Layout>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
      <div className="interview-page">
        {/* Header */}
        <div className="interview-header">
          <div className="interview-meta">
            <h1>🎯 {category} Interview</h1>
            <div className="interview-timer">⏱ {formatTime(elapsed)}</div>
          </div>
          <div className="interview-progress-info">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{answeredCount}/{questions.length} answered</span>
          </div>
          {/* Progress Bar */}
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-header">
            <span className="question-number">Q{currentIndex + 1}</span>
            <span className={`difficulty-badge ${currentQuestion.difficulty?.toLowerCase()}`}>
              {currentQuestion.difficulty || 'Medium'}
            </span>
          </div>
          <p className="question-text">{currentQuestion.questionText}</p>

          <div className="answer-section">
            <label className="answer-label">Your Answer</label>
            <textarea
              className="answer-textarea"
              placeholder="Type your answer here... Be detailed and use technical terms where applicable."
              value={answers[currentIndex] || ''}
              onChange={handleAnswerChange}
              rows={8}
              disabled={submitting}
            />
            <div className="char-count">
              {(answers[currentIndex] || '').length} characters
              {(answers[currentIndex] || '').length < 50 && (answers[currentIndex] || '').length > 0 && (
                <span className="char-hint"> (Add more detail for a better score)</span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="interview-nav">
          <button className="btn-nav-secondary" onClick={handlePrev} disabled={currentIndex === 0 || submitting}>
            ← Previous
          </button>
          <div className="nav-dots">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`nav-dot ${i === currentIndex ? 'active' : ''} ${answers[i]?.trim() ? 'answered' : ''}`}
                onClick={() => setCurrentIndex(i)}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="nav-right-btns">
            {currentIndex < questions.length - 1 ? (
              <>
                <button className="btn-skip" onClick={handleSkip} disabled={submitting}>Skip →</button>
                <button className="btn-nav-primary" onClick={handleNext} disabled={submitting}>
                  Next →
                </button>
              </>
            ) : (
              <button className="btn-submit-interview" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <><div className="btn-spinner"></div> Evaluating...</> : '🚀 Submit Interview'}
              </button>
            )}
          </div>
        </div>

        {/* Answer status dots legend */}
        <div className="dot-legend">
          <span className="legend-item"><span className="dot-indicator active"></span> Current</span>
          <span className="legend-item"><span className="dot-indicator answered"></span> Answered</span>
          <span className="legend-item"><span className="dot-indicator"></span> Unanswered</span>
        </div>
      </div>
    </Layout>
  );
};

export default InterviewPage;
