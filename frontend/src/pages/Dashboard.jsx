import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import api from '../utils/api';
import '../styles/Dashboard.css';

const categories = [
  { name: 'Python', icon: '🐍', color: '#3776AB', desc: 'Lists, OOP, decorators & more' },
  { name: 'Java', icon: '☕', color: '#ED8B00', desc: 'OOP, collections, multithreading' },
  { name: 'C++', icon: '⚙️', color: '#00599C', desc: 'Pointers, STL, templates & OOP' },
  { name: 'DSA', icon: '💡', color: '#9C27B0', desc: 'Arrays, trees, graphs, sorting' },
  { name: 'DBMS', icon: '🗄️', color: '#E91E63', desc: 'SQL, ACID, normalization & more' },
  { name: 'HR', icon: '👤', color: '#4CAF50', desc: 'Behavioral, situational questions' },
  { name: 'FULLSTACK', icon: '🌐', color: '#0ea5e9', desc: 'React, Node, APIs & databases' }
];

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        api.get('/interviews/stats'),
        api.get('/interviews/history')
      ]);
      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (historyRes.data.success) setRecentInterviews(historyRes.data.interviews.slice(0, 3));
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#4CAF50';
    if (score >= 60) return '#FF9800';
    return '#F44336';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Layout>
      <div className="dashboard">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h1>{getGreeting()}, {user?.fullName?.split(' ')[0] || 'User'}! 👋</h1>
            <p>Ready to practice today? Choose a category and start your interview!</p>
          </div>
          <Link to="/categories" className="btn-start-interview">
            🎯 Start Interview
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-info">
              <h3>{loading ? '--' : (stats?.totalInterviews || 0)}</h3>
              <p>Total Interviews</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{loading ? '--' : `${stats?.averageScore || 0}%`}</h3>
              <p>Average Score</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-info">
              <h3>{loading ? '--' : `${stats?.bestScore || 0}%`}</h3>
              <p>Best Score</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-info">
              <h3>{loading ? '--' : formatTime(stats?.totalPracticeTime || 0)}</h3>
              <p>Practice Time</p>
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="section-title">
          <h2>Interview Categories</h2>
          <Link to="/categories" className="view-all">View All →</Link>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link to={`/interview/${cat.name}`} key={cat.name} className="category-card" style={{ '--cat-color': cat.color }}>
              <div className="cat-icon">{cat.icon}</div>
              <div className="cat-info">
                <h3>{cat.name}</h3>
                <p>{cat.desc}</p>
              </div>
              {stats?.categoryBreakdown?.[cat.name] && (
                <div className="cat-score" style={{ color: getScoreColor(stats.categoryBreakdown[cat.name].avgScore) }}>
                  {stats.categoryBreakdown[cat.name].avgScore}%
                </div>
              )}
              <span className="cat-arrow">→</span>
            </Link>
          ))}
        </div>

        {/* Recent Interviews */}
        <div className="section-title">
          <h2>Recent Interviews</h2>
          <Link to="/history" className="view-all">View All →</Link>
        </div>
        {loading ? (
          <div className="loading-state"><div className="spinner"></div><p>Loading history...</p></div>
        ) : recentInterviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No interviews yet</h3>
            <p>Start your first interview to see your results here!</p>
            <Link to="/categories" className="btn-start-interview">Start Now →</Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentInterviews.map(interview => (
              <div key={interview._id} className="recent-item">
                <div className="recent-cat">{categories.find(c => c.name === interview.category)?.icon || '📝'}</div>
                <div className="recent-info">
                  <h4>{interview.category} Interview</h4>
                  <p>{new Date(interview.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="recent-score" style={{ color: getScoreColor(interview.percentage) }}>
                  {interview.percentage}%
                </div>
                <span className={`status-badge ${interview.status}`}>{interview.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
