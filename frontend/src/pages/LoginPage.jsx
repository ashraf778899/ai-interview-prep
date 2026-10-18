import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Toast from '../components/UI/Toast';
import '../styles/AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setToast({ message: 'Please enter your email and password.', type: 'error' }); return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: formData.email, password: formData.password });
      if (res.data.success) {
        if (formData.rememberMe) localStorage.setItem('rememberedEmail', formData.email);
        login(res.data.token, res.data.user);
        setToast({ message: res.data.message, type: 'success' });
        setTimeout(() => navigate('/dashboard'), 800);
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Login failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">🤖</div>
          <h1>Welcome Back!</h1>
          <p>Continue your interview preparation journey</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature"><span>📊</span> View your interview history</div>
          <div className="auth-feature"><span>🎯</span> Continue practicing categories</div>
          <div className="auth-feature"><span>⚡</span> Get instant AI feedback</div>
          <div className="auth-feature"><span>🏆</span> Track your improvement</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Sign In</h2>
          <p className="auth-subtitle">Welcome back! Please enter your credentials.</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email"
                placeholder="Enter your email"
                value={formData.email} onChange={handleChange}
                className="form-input" required autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password} onChange={handleChange}
                  className="form-input" required autoComplete="current-password"
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} />
                <span>Remember me</span>
              </label>
              <span className="forgot-link" onClick={() => setToast({ message: 'Password reset: Please contact admin or re-register.', type: 'info' })}>
                Forgot Password?
              </span>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <><div className="btn-spinner"></div> Signing in...</> : 'Sign In'}
            </button>
          </form>
          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one here</Link>
          </p>

          {/* Demo credentials helper */}
          <div className="demo-credentials">
            <p>💡 <strong>New here?</strong> Register with any email to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
