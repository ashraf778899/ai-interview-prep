import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/LandingPage.css';

const features = [
  { icon: '🤖', title: 'AI-Powered Feedback', desc: 'Get intelligent feedback on your answers using OpenAI GPT or our smart demo evaluation system.' },
  { icon: '🎯', title: 'Multiple Categories', desc: 'Practice Python, Java, C++, DSA, DBMS, HR, and FULLSTACK interview questions tailored to your needs.' },
  { icon: '📊', title: 'Track Your Progress', desc: 'Detailed dashboard with scores, history, and performance analytics to monitor your improvement.' },
  { icon: '⚡', title: 'Instant Results', desc: 'Receive immediate, detailed feedback with strengths and areas for improvement after each interview.' },
  { icon: '🔒', title: 'Secure & Private', desc: 'Your data is protected with JWT authentication and bcrypt encryption. Practice with confidence.' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Fully responsive design that works seamlessly on desktop, tablet, and mobile devices.' }
];

const steps = [
  { num: '1', title: 'Create Account', desc: 'Register for free with your name and email.' },
  { num: '2', title: 'Choose Category', desc: 'Select from Python, Java, C++, DSA, DBMS, HR, or FULLSTACK.' },
  { num: '3', title: 'Answer Questions', desc: 'Answer 5 interview questions at your own pace.' },
  { num: '4', title: 'Get AI Feedback', desc: 'Receive instant scores and detailed feedback.' }
];

const LandingPage = () => {
  return (
    <div className="landing">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <span className="brand-icon">🤖</span>
          <span className="brand-name">AI Interview Prep</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn-nav-login">Login</Link>
          <Link to="/register" className="btn-nav-register">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">🌟 AI-Powered Interview Practice</div>
          <h1 className="hero-title">
            Ace Your Next<br />
            <span className="gradient-text">Technical Interview</span>
          </h1>
          <p className="hero-subtitle">
            Practice with real interview questions across 7 categories. Get instant AI feedback,
            track your progress, and build the confidence to land your dream job.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary-lg">
              🚀 Get Started Free
            </Link>
            <a href="#features" className="btn-secondary-lg">
              Learn More ↓
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item"><strong>7</strong><span>Categories</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><strong>100+</strong><span>Questions</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><strong>AI</strong><span>Feedback</span></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-header">
              <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
              <span className="card-title">Interview Session</span>
            </div>
            <div className="card-body">
              <div className="mock-question">
                <p className="q-label">Question 2 of 5 • Python</p>
                <p className="q-text">Explain the difference between lists and tuples in Python.</p>
              </div>
              <div className="mock-score">
                <div className="score-circle">85<span>%</span></div>
                <div className="score-details">
                  <p className="score-label">Your Score</p>
                  <p className="score-sub">✅ Strong understanding</p>
                  <p className="score-sub">💡 Add examples</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="section-header">
          <h2>Everything You Need to Succeed</h2>
          <p>A complete interview preparation platform built for engineering students</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Get started in minutes and begin improving right away</p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Ace Your Interview?</h2>
        <p>Join thousands of students who are preparing smarter with AI feedback.</p>
        <Link to="/register" className="btn-primary-lg">Start Practicing Now →</Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2024 AI Interview Prep System | Built for CSE AI&DS Mini Project | React + Node.js + MongoDB</p>
      </footer>
    </div>
  );
};

export default LandingPage;
