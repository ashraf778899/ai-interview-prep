import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Toast from '../components/UI/Toast';
import '../styles/AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setToast({ message: 'Please enter your full name (at least 2 characters).', type: 'error' }); return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setToast({ message: 'Please enter a valid email address.', type: 'error' }); return false;
    }
    if (formData.password.length < 6) {
      setToast({ message: 'Password must be at least 6 characters.', type: 'error' }); return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setToast({ message: 'Passwords do not match.', type: 'error' }); return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        setToast({ message: res.data.message, type: 'success' });
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Registration failed. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStrength = (password) => {
    if (password.length === 0) return { level: 0, label: '' };
    if (password.length < 6) return { level: 1, label: 'Too Short' };
    if (password.length < 8) return { level: 2, label: 'Weak' };
    if (/(?=.*[A-Z])(?=.*[0-9])/.test(password)) return { level: 4, label: 'Strong' };
    return { level: 3, label: 'Medium' };
  };

  const strength = getStrength(formData.password);

  return (
    <div className="auth-page">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-logo">🤖</div>
          <h1>AI Interview Prep</h1>
          <p>Your personal AI-powered interview coach</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature"><span>✅</span> Practice 6 interview categories</div>
          <div className="auth-feature"><span>✅</span> Get instant AI feedback</div>
          <div className="auth-feature"><span>✅</span> Track your progress over time</div>
          <div className="auth-feature"><span>✅</span> Free to use forever</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join thousands of students preparing for interviews</p>
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName" name="fullName" type="text"
                placeholder="Enter your full name"
                value={formData.fullName} onChange={handleChange}
                className="form-input" required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email" name="email" type="email"
                placeholder="Enter your email"
                value={formData.email} onChange={handleChange}
                className="form-input" required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={formData.password} onChange={handleChange}
                  className="form-input" required
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1,2,3,4].map(l => <div key={l} className={`strength-bar ${strength.level >= l ? `level-${strength.level}` : ''}`} />)}
                  </div>
                  <span className="strength-label">{strength.label}</span>
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword" name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={formData.confirmPassword} onChange={handleChange}
                className={`form-input ${formData.confirmPassword && formData.password !== formData.confirmPassword ? 'input-error' : ''}`}
                required
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <span className="field-error">❌ Passwords do not match</span>
              )}
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? <><div className="btn-spinner"></div> Creating Account...</> : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
