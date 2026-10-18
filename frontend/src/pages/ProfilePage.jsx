import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import Toast from '../components/UI/Toast';
import api from '../utils/api';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  // Profile form
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || ''
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleProfileChange = (e) => setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.fullName.trim() || !profileData.email.trim()) {
      setToast({ message: 'Name and email are required.', type: 'error' }); return;
    }
    setProfileLoading(true);
    try {
      const res = await api.put('/users/profile', profileData);
      if (res.data.success) {
        updateUser(res.data.user);
        setToast({ message: res.data.message, type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setToast({ message: 'Please fill in all password fields.', type: 'error' }); return;
    }
    if (passwordData.newPassword.length < 6) {
      setToast({ message: 'New password must be at least 6 characters.', type: 'error' }); return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setToast({ message: 'New passwords do not match.', type: 'error' }); return;
    }
    setPasswordLoading(true);
    try {
      const res = await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (res.data.success) {
        setToast({ message: res.data.message, type: 'success' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to change password.', type: 'error' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <Layout>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />
      <div className="profile-page">
        {/* Profile Header */}
        <div className="profile-hero">
          <div className="profile-avatar-large">{getInitials(user?.fullName)}</div>
          <div className="profile-hero-info">
            <h1>{user?.fullName}</h1>
            <p>{user?.email}</p>
            <span className="member-badge">🌟 Active Member</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Personal Info
          </button>
          <button
            className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            🔒 Change Password
          </button>
          <button
            className={`profile-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            ℹ️ About
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Personal Information</h2>
            <p>Update your name and email address.</p>
            <form onSubmit={handleProfileSubmit} className="profile-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName" name="fullName" type="text"
                  value={profileData.fullName}
                  onChange={handleProfileChange}
                  className="form-input" placeholder="Your full name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email" name="email" type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="form-input" placeholder="Your email"
                />
              </div>
              <button type="submit" className="btn-save" disabled={profileLoading}>
                {profileLoading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="profile-section">
            <h2>Change Password</h2>
            <p>Make sure your new password is at least 6 characters long.</p>
            <form onSubmit={handlePasswordSubmit} className="profile-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  name="currentPassword" type={showPasswords ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input" placeholder="Enter current password"
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  name="newPassword" type={showPasswords ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input" placeholder="Enter new password (min 6 chars)"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  name="confirmNewPassword" type={showPasswords ? 'text' : 'password'}
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className={`form-input ${passwordData.confirmNewPassword && passwordData.newPassword !== passwordData.confirmNewPassword ? 'input-error' : ''}`}
                  placeholder="Confirm new password"
                />
              </div>
              <label className="show-pass-toggle">
                <input type="checkbox" checked={showPasswords} onChange={e => setShowPasswords(e.target.checked)} />
                Show passwords
              </label>
              <button type="submit" className="btn-save" disabled={passwordLoading}>
                {passwordLoading ? 'Changing...' : '🔒 Change Password'}
              </button>
            </form>
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="profile-section">
            <h2>About This Project</h2>
            <div className="about-grid">
              <div className="about-card">
                <h3>🤖 Tech Stack</h3>
                <ul>
                  <li><strong>Frontend:</strong> React.js + Vite</li>
                  <li><strong>Backend:</strong> Node.js + Express.js</li>
                  <li><strong>Database:</strong> MongoDB + Mongoose</li>
                  <li><strong>Auth:</strong> JWT + bcrypt</li>
                  <li><strong>AI:</strong> OpenAI GPT-3.5 / Demo Mode</li>
                </ul>
              </div>
              <div className="about-card">
                <h3>🎯 Features</h3>
                <ul>
                  <li>✅ 7 Interview Categories</li>
                  <li>✅ 100+ Practice Questions</li>
                  <li>✅ AI-Powered Evaluation</li>
                  <li>✅ Progress Tracking</li>
                  <li>✅ Detailed Feedback</li>
                </ul>
              </div>
              <div className="about-card">
                <h3>📚 Mini Project Info</h3>
                <ul>
                  <li><strong>Course:</strong> CSE AI&DS</li>
                  <li><strong>Type:</strong> Full Stack Web App</li>
                  <li><strong>Purpose:</strong> Interview Preparation</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
