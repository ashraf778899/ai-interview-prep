import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import api from '../utils/api';
import '../styles/HistoryPage.css';

const categoryIcons = {
  Python: '🐍', Java: '☕', 'C++': '⚙️', DSA: '💡', DBMS: '🗄️', HR: '👤', FULLSTACK: '🌐'
};

const HistoryPage = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/interviews/history');
      if (res.data.success) setInterviews(res.data.interviews);
    } catch (err) {
      console.error('History error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (pct) => {
    if (pct >= 80) return '#4CAF50';
    if (pct >= 60) return '#FF9800';
    return '#F44336';
  };

  const getGradeLabel = (pct) => {
    if (pct >= 80) return 'Excellent';
    if (pct >= 60) return 'Good';
    if (pct >= 40) return 'Average';
    return 'Needs Work';
  };

  const categories = ['All', 'Python', 'Java', 'C++', 'DSA', 'DBMS', 'HR', 'FULLSTACK'];

  const filtered = interviews
    .filter(i => filterCategory === 'All' || i.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.completedAt) - new Date(a.completedAt);
      if (sortBy === 'oldest') return new Date(a.completedAt) - new Date(b.completedAt);
      if (sortBy === 'highest') return b.percentage - a.percentage;
      if (sortBy === 'lowest') return a.percentage - b.percentage;
      return 0;
    });

  if (loading) return <Layout><LoadingSpinner text="Loading interview history..." /></Layout>;

  return (
    <Layout>
      <div className="history-page">
        <div className="history-header">
          <div>
            <h1>📋 Interview History</h1>
            <p>Review your past interviews and track your improvement over time.</p>
          </div>
          <div className="history-total">
            <span className="total-num">{interviews.length}</span>
            <span className="total-label">Total Sessions</span>
          </div>
        </div>

        {/* Filters */}
        <div className="history-filters">
          <div className="filter-group">
            <label>Category:</label>
            <div className="filter-tabs">
              {categories.map(c => (
                <button
                  key={c}
                  className={`filter-tab ${filterCategory === c ? 'active' : ''}`}
                  onClick={() => setFilterCategory(c)}
                >{c}</button>
              ))}
            </div>
          </div>
          <div className="sort-group">
            <label>Sort:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Score</option>
              <option value="lowest">Lowest Score</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📝</div>
            <h3>{interviews.length === 0 ? 'No interviews yet' : `No ${filterCategory} interviews`}</h3>
            <p>{interviews.length === 0 ? 'Complete your first interview to see history here!' : 'Try a different filter or start a new interview.'}</p>
            <button onClick={() => navigate('/categories')} className="btn-start-new">Start Interview</button>
          </div>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Evaluation</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((interview, index) => (
                  <tr key={interview._id}>
                    <td className="row-num">{index + 1}</td>
                    <td>
                      <div className="cat-cell">
                        <span className="cat-cell-icon">{categoryIcons[interview.category] || '📝'}</span>
                        <span>{interview.category}</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(interview.completedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      <span className="time-cell">{new Date(interview.completedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td>
                      <div className="score-cell">
                        <span className="score-pct" style={{ color: getScoreColor(interview.percentage) }}>
                          {interview.percentage}%
                        </span>
                        <span className="score-label-small">{getGradeLabel(interview.percentage)}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-pill ${interview.status}`}>{interview.status}</span>
                    </td>
                    <td>
                      <span className={`eval-pill ${interview.evaluationMethod}`}>
                        {interview.evaluationMethod === 'openai' ? '🤖 AI' : '📊 Demo'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-view-result"
                        onClick={() => navigate(`/results/${interview._id}`)}
                      >
                        View Results
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HistoryPage;
