import React, { useState } from 'react';

export default function ResumeForm({ data, onChange, onEnhance, isEnhancing, onOpenUploadModal }) {
  const [activeTab, setActiveTab] = useState('personal');

  const handlePersonalChange = (field, val) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: val,
      },
    });
  };

  const handleArrayChange = (section, index, field, val) => {
    const list = [...(data[section] || [])];
    list[index] = { ...list[index], [field]: val };
    onChange({ ...data, [section]: list });
  };

  const handleAddArrayItem = (section, defaultItem) => {
    const list = [...(data[section] || []), defaultItem];
    onChange({ ...data, [section]: list });
  };

  const handleRemoveArrayItem = (section, index) => {
    const list = (data[section] || []).filter((_, i) => i !== index);
    onChange({ ...data, [section]: list });
  };

  const handleSkillsChange = (category, commaString) => {
    const arr = commaString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onChange({
      ...data,
      skills: {
        ...data.skills,
        [category]: arr,
      },
    });
  };

  const addSkillChip = (category, skill) => {
    const current = data.skills?.[category] || [];
    if (!current.includes(skill)) {
      onChange({
        ...data,
        skills: {
          ...data.skills,
          [category]: [...current, skill],
        },
      });
    }
  };

  const handleHighlightChange = (section, itemIdx, highlightIdx, val) => {
    const list = [...(data[section] || [])];
    const highlights = [...(list[itemIdx].highlights || [])];
    highlights[highlightIdx] = val;
    list[itemIdx] = { ...list[itemIdx], highlights };
    onChange({ ...data, [section]: list });
  };

  const handleAddHighlight = (section, itemIdx) => {
    const list = [...(data[section] || [])];
    const highlights = [...(list[itemIdx].highlights || []), 'Engineered key architectural features and optimized performance metrics.'];
    list[itemIdx] = { ...list[itemIdx], highlights };
    onChange({ ...data, [section]: list });
  };

  const handleRemoveHighlight = (section, itemIdx, highlightIdx) => {
    const list = [...(data[section] || [])];
    const highlights = (list[itemIdx].highlights || []).filter((_, i) => i !== highlightIdx);
    list[itemIdx] = { ...list[itemIdx], highlights };
    onChange({ ...data, [section]: list });
  };

  const targetRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Full Stack Developer',
    'AI/ML Engineer',
    'Data Scientist',
    'Backend Engineer',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Banner: Target Role & Quick Actions */}
      <div style={{ padding: '16px 20px', backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
              🎯 Target Placement Role
            </label>
            <select
              value={data.targetRole || 'Software Engineer'}
              onChange={(e) => onChange({ ...data, targetRole: e.target.value })}
              style={{ fontWeight: 700, color: '#0f172a', backgroundColor: '#ffffff', width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            >
              {targetRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onOpenUploadModal}
              style={{
                fontSize: '13px',
                padding: '9px 15px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer'
              }}
              title="Upload existing resume (PDF or TXT) to auto-fill"
            >
              <span>📂 Import / Upload</span>
            </button>

            <button
              type="button"
              onClick={onEnhance}
              disabled={isEnhancing}
              style={{
                fontSize: '13px',
                padding: '9px 16px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: isEnhancing ? 'wait' : 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}
              title="Use AI to polish bullet points and tailor for target role"
            >
              <span>{isEnhancing ? '✨ Enhancing...' : '⚡ AI Polish & Tailor'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid #e2e8f0' }}>
        {[
          { id: 'personal', label: '👤 Contact' },
          { id: 'summary', label: '📝 Summary' },
          { id: 'skills', label: '⚡ Skills' },
          { id: 'projects', label: '💻 Projects' },
          { id: 'experience', label: '💼 Experience' },
          { id: 'education', label: '🎓 Education' },
          { id: 'extras', label: '🏆 Honors' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '9px 14px',
              borderRadius: '8px 8px 0 0',
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 700 : 500,
              backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#2563eb' : '#64748b',
              borderBottom: activeTab === tab.id ? '2.5px solid #2563eb' : '2.5px solid transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Personal Details */}
      {activeTab === 'personal' && (
        <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Personal & Contact Details</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>Full Name *</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={data.personalInfo?.fullName || ''}
                onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>Email Address *</label>
              <input
                type="email"
                placeholder="alex.johnson@college.edu"
                value={data.personalInfo?.email || ''}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>Phone Number *</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={data.personalInfo?.phone || ''}
                onChange={(e) => handlePersonalChange('phone', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>Location / City</label>
              <input
                type="text"
                placeholder="Bangalore, India"
                value={data.personalInfo?.location || ''}
                onChange={(e) => handlePersonalChange('location', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>LinkedIn Profile URL</label>
              <input
                type="text"
                placeholder="https://linkedin.com/in/alex-johnson"
                value={data.personalInfo?.linkedin || ''}
                onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>GitHub Profile URL</label>
              <input
                type="text"
                placeholder="https://github.com/alex-johnson"
                value={data.personalInfo?.github || ''}
                onChange={(e) => handlePersonalChange('github', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>Portfolio / Website URL</label>
              <input
                type="text"
                placeholder="https://alexjohnson.dev"
                value={data.personalInfo?.portfolio || ''}
                onChange={(e) => handlePersonalChange('portfolio', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Summary */}
      {activeTab === 'summary' && (
        <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Professional Summary</h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {data.summary ? data.summary.split(/\s+/).filter(Boolean).length : 0} words
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '10px' }}>
            A tailored 3-4 sentence elevator pitch highlighting your technical competencies for <strong>{data.targetRole || 'Software Engineer'}</strong>.
          </p>
          <textarea
            rows={5}
            placeholder="Write a concise professional summary..."
            value={data.summary || ''}
            onChange={(e) => onChange({ ...data, summary: e.target.value })}
            style={{ width: '100%', lineHeight: 1.6, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          />
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onEnhance}
              style={{ fontSize: '12.5px', padding: '7px 14px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', color: '#1e293b' }}
            >
              ⚡ Re-generate Summary for {data.targetRole}
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Skills */}
      {activeTab === 'skills' && (
        <div style={{ padding: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Technical & Soft Skills</h3>
            <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '4px' }}>
              Separate skills with commas, or click quick recommendation chips.
            </p>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>
              Programming Languages (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Python, Java, C++, JavaScript (ES6+), SQL, TypeScript"
              value={(data.skills?.technical || []).join(', ')}
              onChange={(e) => handleSkillsChange('technical', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'C#', 'Go'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkillChip('technical', s)}
                  style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>
              Frameworks & Libraries (comma-separated)
            </label>
            <input
              type="text"
              placeholder="React.js, Node.js, Express.js, Tailwind CSS, FastAPI, PyTorch"
              value={(data.skills?.frameworks || []).join(', ')}
              onChange={(e) => handleSkillsChange('frameworks', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
              {['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'FastAPI', 'PyTorch', 'TensorFlow', 'Spring Boot'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkillChip('frameworks', s)}
                  style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer' }}
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>
              Developer Tools & Databases (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Git, GitHub, MongoDB, PostgreSQL, Docker, Postman, Linux"
              value={(data.skills?.tools || []).join(', ')}
              onChange={(e) => handleSkillsChange('tools', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '4px', color: '#334155' }}>
              Soft Skills & Methodologies
            </label>
            <input
              type="text"
              placeholder="Problem Solving, Critical Thinking, Agile/Scrum, Team Leadership, Effective Communication"
              value={(data.skills?.soft || []).join(', ')}
              onChange={(e) => handleSkillsChange('soft', e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        </div>
      )}

      {/* Tab 4: Projects */}
      {activeTab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Technical Projects</h3>
            <button
              type="button"
              onClick={() =>
                handleAddArrayItem('projects', {
                  id: 'proj-' + Date.now(),
                  title: 'New Project Title',
                  techStack: ['React', 'Node.js'],
                  liveUrl: '',
                  githubUrl: '',
                  description: 'Brief description of project.',
                  highlights: ['Architected key modules and optimized response time.'],
                })
              }
              style={{ fontSize: '12px', padding: '6px 12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
            >
              + Add Project
            </button>
          </div>

          {(data.projects || []).map((proj, pIdx) => (
            <div key={proj.id || pIdx} style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                  Project #{pIdx + 1}: {proj.title || 'Untitled'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('projects', pIdx)}
                  style={{ color: '#ef4444', background: 'none', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  ✕ Remove
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Project Title</label>
                  <input
                    type="text"
                    value={proj.title || ''}
                    onChange={(e) => handleArrayChange('projects', pIdx, 'title', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={(proj.techStack || []).join(', ')}
                    onChange={(e) =>
                      handleArrayChange(
                        'projects',
                        pIdx,
                        'techStack',
                        e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                      )
                    }
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>GitHub URL</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={proj.githubUrl || ''}
                    onChange={(e) => handleArrayChange('projects', pIdx, 'githubUrl', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Overview</label>
                <input
                  type="text"
                  placeholder="One sentence overview..."
                  value={proj.description || ''}
                  onChange={(e) => handleArrayChange('projects', pIdx, 'description', e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Bullet Highlights</label>
                  <button
                    type="button"
                    onClick={() => handleAddHighlight('projects', pIdx)}
                    style={{ fontSize: '11px', color: '#2563eb', background: 'none', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    + Add Bullet
                  </button>
                </div>
                {(proj.highlights || []).map((h, hIdx) => (
                  <div key={hIdx} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleHighlightChange('projects', pIdx, hIdx, e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight('projects', pIdx, hIdx)}
                      style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 5: Experience */}
      {activeTab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Internships & Experience</h3>
            <button
              type="button"
              onClick={() =>
                handleAddArrayItem('experience', {
                  id: 'exp-' + Date.now(),
                  role: 'Software Intern',
                  company: 'Company Name',
                  location: 'Remote / City',
                  startDate: 'Jun 2024',
                  endDate: 'Aug 2024',
                  current: false,
                  highlights: ['Contributed to feature implementations and automated unit tests.'],
                })
              }
              style={{ fontSize: '12px', padding: '6px 12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
            >
              + Add Experience
            </button>
          </div>

          {(data.experience || []).map((exp, eIdx) => (
            <div key={exp.id || eIdx} style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                  {exp.role || 'Role'} at {exp.company || 'Company'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('experience', eIdx)}
                  style={{ color: '#ef4444', background: 'none', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  ✕ Remove
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Role / Job Title</label>
                  <input
                    type="text"
                    value={exp.role || ''}
                    onChange={(e) => handleArrayChange('experience', eIdx, 'role', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Organization / Company</label>
                  <input
                    type="text"
                    value={exp.company || ''}
                    onChange={(e) => handleArrayChange('experience', eIdx, 'company', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Duration (e.g. May 2024 - Jul 2024)</label>
                  <input
                    type="text"
                    value={`${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('-');
                      handleArrayChange('experience', eIdx, 'startDate', parts[0]?.trim() || '');
                      handleArrayChange('experience', eIdx, 'endDate', parts[1]?.trim() || '');
                    }}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>Responsibilities & Impact</label>
                  <button
                    type="button"
                    onClick={() => handleAddHighlight('experience', eIdx)}
                    style={{ fontSize: '11px', color: '#2563eb', background: 'none', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    + Add Bullet
                  </button>
                </div>
                {(exp.highlights || []).map((h, hIdx) => (
                  <div key={hIdx} style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleHighlightChange('experience', eIdx, hIdx, e.target.value)}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight('experience', eIdx, hIdx)}
                      style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 6: Education */}
      {activeTab === 'education' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Education</h3>
            <button
              type="button"
              onClick={() =>
                handleAddArrayItem('education', {
                  id: 'edu-' + Date.now(),
                  institution: 'Institution / College Name',
                  degree: 'B.Tech in Computer Science',
                  fieldOfStudy: 'AI & Data Science',
                  startDate: '2022',
                  endDate: '2026',
                  grade: '8.5 CGPA',
                })
              }
              style={{ fontSize: '12px', padding: '6px 12px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
            >
              + Add Education
            </button>
          </div>

          {(data.education || []).map((edu, eduIdx) => (
            <div key={edu.id || eduIdx} style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                  {edu.degree || 'Degree'} at {edu.institution || 'College'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('education', eduIdx)}
                  style={{ color: '#ef4444', background: 'none', fontSize: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                >
                  ✕ Remove
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Degree</label>
                  <input
                    type="text"
                    value={edu.degree || ''}
                    onChange={(e) => handleArrayChange('education', eduIdx, 'degree', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Branch / Major</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy || ''}
                    onChange={(e) => handleArrayChange('education', eduIdx, 'fieldOfStudy', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>College / University</label>
                  <input
                    type="text"
                    value={edu.institution || ''}
                    onChange={(e) => handleArrayChange('education', eduIdx, 'institution', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Grade / CGPA</label>
                  <input
                    type="text"
                    value={edu.grade || ''}
                    onChange={(e) => handleArrayChange('education', eduIdx, 'grade', e.target.value)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, display: 'block', marginBottom: '3px' }}>Years (Start - End)</label>
                  <input
                    type="text"
                    placeholder="2022 - 2026"
                    value={`${edu.startDate || ''} - ${edu.endDate || ''}`}
                    onChange={(e) => {
                      const parts = e.target.value.split('-');
                      handleArrayChange('education', eduIdx, 'startDate', parts[0]?.trim() || '');
                      handleArrayChange('education', eduIdx, 'endDate', parts[1]?.trim() || '');
                    }}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 7: Honors */}
      {activeTab === 'extras' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Certifications</h3>
              <button
                type="button"
                onClick={() =>
                  handleAddArrayItem('certifications', {
                    name: 'Certification Name',
                    issuer: 'Issuing Organization',
                    issueDate: '2024',
                  })
                }
                style={{ fontSize: '11.5px', padding: '5px 10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add Certificate
              </button>
            </div>

            {(data.certifications || []).map((cert, cIdx) => (
              <div key={cIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Certificate Name"
                  value={cert.name || ''}
                  onChange={(e) => handleArrayChange('certifications', cIdx, 'name', e.target.value)}
                  style={{ flex: 2, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="Issuer (e.g. AWS, Meta)"
                  value={cert.issuer || ''}
                  onChange={(e) => handleArrayChange('certifications', cIdx, 'issuer', e.target.value)}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('certifications', cIdx)}
                  style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div style={{ padding: '16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Honors & Achievements</h3>
              <button
                type="button"
                onClick={() =>
                  handleAddArrayItem('achievements', {
                    title: 'Competition / Hackathon Title',
                    description: 'Details of accomplishment.',
                  })
                }
                style={{ fontSize: '11.5px', padding: '5px 10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
              >
                + Add Achievement
              </button>
            </div>

            {(data.achievements || []).map((ach, aIdx) => (
              <div key={aIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Achievement Title"
                  value={ach.title || ''}
                  onChange={(e) => handleArrayChange('achievements', aIdx, 'title', e.target.value)}
                  style={{ flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <input
                  type="text"
                  placeholder="Details"
                  value={ach.description || ''}
                  onChange={(e) => handleArrayChange('achievements', aIdx, 'description', e.target.value)}
                  style={{ flex: 2, padding: '7px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveArrayItem('achievements', aIdx)}
                  style={{ color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '6px' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
