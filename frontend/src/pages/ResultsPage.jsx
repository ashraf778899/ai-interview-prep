import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import api from '../utils/api';
import '../styles/ResultsPage.css';

const ResultsPage = () => {
  const { interviewId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const evaluationMode = location.state?.evaluationMode || '';

  useEffect(() => {
    fetchResults();
  }, [interviewId]);

  const fetchResults = async () => {
    try {
      const res = await api.get(`/interviews/${interviewId}`);
      if (res.data.success) setInterview(res.data.interview);
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return '#4CAF50';
    if (pct >= 60) return '#FF9800';
    return '#F44336';
  };

  const getGrade = (pct) => {
    if (pct >= 90) return { grade: 'A+', label: 'Outstanding', emoji: '🏆' };
    if (pct >= 80) return { grade: 'A', label: 'Excellent', emoji: '🌟' };
    if (pct >= 70) return { grade: 'B', label: 'Good', emoji: '👍' };
    if (pct >= 60) return { grade: 'C', label: 'Average', emoji: '👌' };
    if (pct >= 40) return { grade: 'D', label: 'Needs Work', emoji: '📚' };
    return { grade: 'F', label: 'Keep Practicing', emoji: '💪' };
  };

  if (loading) return <Layout><LoadingSpinner text="Loading your results..." /></Layout>;
  if (!interview) return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Results not found</h2>
        <Link to="/dashboard" className="btn-back-dash">Go to Dashboard</Link>
      </div>
    </Layout>
  );

  const safePercentage = (typeof interview.percentage === 'number' && !isNaN(interview.percentage)) ? interview.percentage : 0;
  const safeTotalScore = (typeof interview.totalScore === 'number' && !isNaN(interview.totalScore)) ? interview.totalScore : 0;
  const safeMaxScore = (typeof interview.maxPossibleScore === 'number' && !isNaN(interview.maxPossibleScore) && interview.maxPossibleScore > 0) ? interview.maxPossibleScore : 50;

  const gradeInfo = getGrade(safePercentage);
  const correctAnswers = Array.isArray(interview.answers) ? interview.answers.filter(a => {
    const s = typeof a.score === 'number' && !isNaN(a.score) ? a.score : 0;
    const m = typeof a.maxScore === 'number' && a.maxScore > 0 ? a.maxScore : 10;
    return (s / m) >= 0.6;
  }).length : 0;

  return (
    <Layout>
      <div className="results-page">
        {/* Evaluation Mode Badge */}
        {evaluationMode && (
          <div className={`eval-badge ${interview.evaluationMethod}`}>
            {evaluationMode}
          </div>
        )}

        {/* Score Card */}
        <div className="results-hero">
          <div className="results-grade">
            <div className="grade-circle" style={{ borderColor: getScoreColor(safePercentage) }}>
              <span className="grade-letter">{gradeInfo.grade}</span>
              <span className="grade-pct">{safePercentage}%</span>
            </div>
            <h1>{gradeInfo.emoji} {gradeInfo.label}!</h1>
            <p className="grade-label">{interview.category} Interview Result</p>
          </div>

          <div className="results-summary">
            <div className="summary-stat">
              <span className="summary-val">{safeTotalScore}/{safeMaxScore}</span>
              <span className="summary-label">Total Score</span>
            </div>
            <div className="summary-stat">
              <span className="summary-val">{correctAnswers}/{interview.answers.length}</span>
              <span className="summary-label">Good Answers</span>
            </div>
            <div className="summary-stat">
              <span className="summary-val">{interview.duration || 0}m</span>
              <span className="summary-label">Duration</span>
            </div>
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="feedback-card">
          <h3>📝 Overall Feedback</h3>
          <p>{interview.overallFeedback}</p>
        </div>

        {/* Strengths & Improvements */}
        <div className="strengths-improvements">
          <div className="strengths-card">
            <h3>✅ Your Strengths</h3>
            {interview.strengths?.length > 0 ? (
              <ul>{interview.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            ) : <p className="empty-text">Keep practicing to identify your strengths!</p>}
          </div>
          <div className="improvements-card">
            <h3>💡 Areas to Improve</h3>
            {interview.areasForImprovement?.length > 0 ? (
              <ul>{interview.areasForImprovement.map((imp, i) => <li key={i}>{imp}</li>)}</ul>
            ) : <p className="empty-text">Great job - no major areas of concern!</p>}
          </div>
        </div>

        {/* Detailed Answer Review */}
        <div className="answers-review">
          <h3>📊 Detailed Answer Review</h3>
          {interview.answers.map((ans, index) => {
            const pct = ans.maxScore > 0 ? Math.round((ans.score / ans.maxScore) * 100) : 0;
            return (
              <div key={index} className="answer-review-card">
                <div
                  className="answer-review-header"
                  onClick={() => setExpandedAnswers(prev => ({ ...prev, [index]: !prev[index] }))}
                >
                  <div className="ans-q-info">
                    <span className="ans-q-num">Q{index + 1}</span>
                    <p className="ans-q-text">{ans.questionText}</p>
                  </div>
                  <div className="ans-score" style={{ color: getScoreColor(pct) }}>
                    {ans.score}/{ans.maxScore}
                  </div>
                  <span className="expand-icon">{expandedAnswers[index] ? '▲' : '▼'}</span>
                </div>
                {expandedAnswers[index] && (
                  <div className="answer-review-body">
                    <div className="user-answer-box">
                      <strong>Your Answer:</strong>
                      <p>{ans.userAnswer || <em>No answer provided</em>}</p>
                    </div>
                    <div className="ai-feedback-box">
                      <strong>🤖 AI Feedback:</strong>
                      <p>{ans.feedback}</p>
                    </div>
                    {ans.strengths?.length > 0 && (
                      <div className="ans-strengths">
                        <strong>✅ Strengths:</strong>
                        <ul>{ans.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                      </div>
                    )}
                    {ans.improvements?.length > 0 && (
                      <div className="ans-improvements">
                        <strong>💡 Improvements:</strong>
                        <ul>{ans.improvements.map((imp, i) => <li key={i}>{imp}</li>)}</ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button onClick={() => navigate(`/interview/${interview.category}`)} className="btn-retry">
            🔄 Retry {interview.category}
          </button>
          <Link to="/categories" className="btn-new-cat">
            🎯 Try New Category
          </Link>
          <Link to="/dashboard" className="btn-dashboard">
            📊 Dashboard
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default ResultsPage;
