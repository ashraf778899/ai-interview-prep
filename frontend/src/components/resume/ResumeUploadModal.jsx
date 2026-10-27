import React, { useState } from 'react';
import api from '../../utils/api';

export default function ResumeUploadModal({ isOpen, onClose, onDataExtracted }) {
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be under 5MB.');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleExtract = async () => {
    setError('');
    setLoading(true);

    try {
      let res;
      if (activeTab === 'file') {
        if (!selectedFile) {
          setError('Please select a PDF or TXT resume file to upload.');
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append('resumeFile', selectedFile);

        res = await api.post('/resumes/upload-parse', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        if (!pastedText.trim() || pastedText.trim().length < 20) {
          setError('Please paste at least a few lines of resume text.');
          setLoading(false);
          return;
        }

        res = await api.post('/resumes/parse-text', { text: pastedText });
      }

      if (res.data?.success && res.data?.extractedData) {
        onDataExtracted(res.data.extractedData, res.data.source);
        onClose();
      } else {
        setError('Could not extract data from the provided document.');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to extract resume data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Import & Extract Resume
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              Upload your existing CV / biodata to auto-fill sections with smart extraction.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', color: '#94a3b8', fontSize: '20px', border: 'none', cursor: 'pointer', padding: '4px' }}
          >
            ✕
          </button>
        </div>

        {/* Tab selection */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => {
              setActiveTab('file');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13.5px',
              fontWeight: 700,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'file' ? '#0f172a' : '#f8fafc',
              color: activeTab === 'file' ? '#ffffff' : '#334155',
              border: activeTab === 'file' ? '1px solid #0f172a' : '1px solid #cbd5e1',
            }}
          >
            📄 Upload PDF / TXT File
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('text');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '8px',
              fontSize: '13.5px',
              fontWeight: 700,
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: activeTab === 'text' ? '#0f172a' : '#f8fafc',
              color: activeTab === 'text' ? '#ffffff' : '#334155',
              border: activeTab === 'text' ? '1px solid #0f172a' : '1px solid #cbd5e1',
            }}
          >
            📋 Paste Resume Text
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              border: '1px solid #fecaca',
              fontSize: '13px',
              marginBottom: '14px',
            }}
          >
            {error}
          </div>
        )}

        {activeTab === 'file' ? (
          <div>
            <label
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                backgroundColor: '#f8fafc',
                transition: 'border-color 0.2s',
              }}
            >
              <span style={{ fontSize: '36px', marginBottom: '8px' }}>📄</span>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>
                {selectedFile ? selectedFile.name : 'Click to select or drag PDF file'}
              </span>
              <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                Supports .PDF, .TXT up to 5MB
              </span>
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            {selectedFile && (
              <div style={{ marginTop: '10px', fontSize: '12.5px', color: '#10b981', fontWeight: 600 }}>
                ✓ Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>
        ) : (
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 600, display: 'block', marginBottom: '6px', color: '#334155' }}>
              Paste your raw CV text below:
            </label>
            <textarea
              rows={8}
              placeholder="Paste existing resume text here including your education, skills, projects, and contact info..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              style={{ width: '100%', fontSize: '13px', lineHeight: 1.5, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '9px 16px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExtract}
            disabled={loading}
            style={{
              padding: '9px 20px',
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer',
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
            }}
          >
            {loading ? 'Analyzing & Extracting...' : '✨ Extract & Populate Resume'}
          </button>
        </div>
      </div>
    </div>
  );
}
