import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import Layout from '../components/Layout/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import ResumeForm from '../components/resume/ResumeForm';
import ResumeUploadModal from '../components/resume/ResumeUploadModal';
import {
  ModernTemplate,
  ClassicTemplate,
  MinimalistTemplate,
  CreativeTemplate,
} from '../components/resume/ResumeTemplates';

export default function ResumeBuilder() {
  const { user } = useAuth();
  const previewRef = useRef(null);

  const [resumeData, setResumeData] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });
  const [viewMode, setViewMode] = useState('split'); // 'split', 'edit', 'preview'
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await api.get('/resumes/latest');
      if (res.data?.success && res.data?.resume) {
        setResumeData(res.data.resume);
        if (res.data.resume.template) {
          setSelectedTemplate(res.data.resume.template);
        }
      }
    } catch (err) {
      console.warn('Could not fetch resume, using fallback starter:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification({ type: '', text: '' }), 5000);
  };

  const handleSave = async (customData = null) => {
    const dataToSave = customData || resumeData;
    if (!dataToSave) return;

    setSaving(true);
    try {
      const payload = {
        ...dataToSave,
        template: selectedTemplate,
      };
      const res = await api.post('/resumes', payload);
      if (res.data?.success) {
        if (res.data.resume?._id) {
          setResumeData(res.data.resume);
        }
        showNotification('success', 'Resume saved successfully!');
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message || 'Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleEnhance = async () => {
    if (!resumeData) return;
    setIsEnhancing(true);

    try {
      const res = await api.post('/resumes/enhance', {
        resumeData,
        targetRole: resumeData.targetRole || 'Software Engineer',
      });
      if (res.data?.success && res.data?.enhancedResume) {
        setResumeData(res.data.enhancedResume);
        showNotification(
          'success',
          `Resume tailored & polished for "${resumeData.targetRole}"! (${res.data.enhancedResume.enhancementSource || 'AI Engine'})`
        );
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || err.message || 'Enhancement failed.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDataExtracted = (extractedData, source) => {
    setResumeData((prev) => ({
      ...prev,
      ...extractedData,
      personalInfo: {
        ...prev?.personalInfo,
        ...extractedData.personalInfo,
      },
      skills: {
        ...prev?.skills,
        ...extractedData.skills,
      },
    }));
    showNotification('success', `Information extracted and loaded into resume editor! (${source})`);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('resume-pdf-canvas');
    if (!element) {
      alert('Resume element not found.');
      return;
    }

    setIsDownloadingPdf(true);

    const candidateName = resumeData?.personalInfo?.fullName || user?.fullName || 'Candidate';
    const role = resumeData?.targetRole || 'Resume';
    const filename = `${candidateName.replace(/\s+/g, '_')}_${role.replace(/\s+/g, '_')}_Resume.pdf`;

    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsDownloadingPdf(false);
        showNotification('success', `PDF downloaded: ${filename}`);
      })
      .catch((err) => {
        console.error('PDF generation error:', err);
        setIsDownloadingPdf(false);
        window.print();
      });
  };

  const templates = [
    { id: 'modern', name: 'Modern Tech' },
    { id: 'classic', name: 'Classic Ivy' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'creative', name: 'Creative AI' },
  ];

  if (loading || !resumeData) {
    return (
      <Layout>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
          <p style={{ color: '#64748b' }}>Preparing your Resume Builder workspace...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ResumeUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataExtracted={handleDataExtracted}
      />

      <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '40px' }}>
        {/* Top Header Card */}
        <div
          style={{
            marginBottom: '20px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>📄</span>
              <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                AI Placement Resume Builder
              </h1>
              <span
                style={{
                  background: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  borderRadius: '9999px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                ATS Ready
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
              Create, optimize, live-preview, and download your targeted engineering placement resume.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'edit' ? '#ffffff' : 'transparent',
                  color: viewMode === 'edit' ? '#0f172a' : '#64748b',
                  boxShadow: viewMode === 'edit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                ✏️ Edit Only
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'split' ? '#ffffff' : 'transparent',
                  color: viewMode === 'split' ? '#0f172a' : '#64748b',
                  boxShadow: viewMode === 'split' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                🌓 Split View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                style={{
                  padding: '6px 12px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'preview' ? '#ffffff' : 'transparent',
                  color: viewMode === 'preview' ? '#0f172a' : '#64748b',
                  boxShadow: viewMode === 'preview' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                👁️ Preview Only
              </button>
            </div>

            <button
              onClick={() => handleSave()}
              disabled={saving}
              style={{
                fontSize: '13px',
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                border: '1.5px solid #cbd5e1',
                borderRadius: '8px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
              }}
            >
              <span>{saving ? 'Saving...' : '💾 Save Resume'}</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isDownloadingPdf}
              style={{
                fontSize: '13px',
                padding: '9px 18px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: isDownloadingPdf ? 'wait' : 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
              }}
            >
              <span>{isDownloadingPdf ? 'Generating PDF...' : '📥 Download PDF'}</span>
            </button>
          </div>
        </div>

        {/* Notification Alert */}
        {notification.text && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              backgroundColor: notification.type === 'success' ? '#ecfdf5' : '#fef2f2',
              color: notification.type === 'success' ? '#10b981' : '#ef4444',
              border: `1px solid ${notification.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
              fontSize: '13.5px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{notification.text}</span>
            <button
              onClick={() => setNotification({ type: '', text: '' })}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Template Selector Bar */}
        <div
          style={{
            marginBottom: '20px',
            padding: '14px 20px',
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>
            Choose Template:
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {templates.map((tpl) => {
              const isSelected = selectedTemplate === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(tpl.id);
                    setResumeData({ ...resumeData, template: tpl.id });
                  }}
                  style={{
                    padding: '7px 14px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#0f172a' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? '1.5px solid #0f172a' : '1px solid #cbd5e1',
                  }}
                >
                  <span>{isSelected ? '✓ ' : ''}{tpl.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Workspace */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              viewMode === 'split' ? 'minmax(420px, 1fr) minmax(460px, 1fr)' : '1fr',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Form Editor */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div style={{ minWidth: 0 }}>
              <ResumeForm
                data={resumeData}
                onChange={setResumeData}
                onEnhance={handleEnhance}
                isEnhancing={isEnhancing}
                onOpenUploadModal={() => setIsUploadOpen(true)}
              />
            </div>
          )}

          {/* Right Column: Live Sheet Preview */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  position: 'sticky',
                  top: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                    Live A4 Preview ({selectedTemplate} template)
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      style={{ fontSize: '12px', padding: '6px 12px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      🖨️ Print
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      disabled={isDownloadingPdf}
                      style={{ fontSize: '12px', padding: '6px 14px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      📥 PDF
                    </button>
                  </div>
                </div>

                {/* Printable A4 Canvas Container */}
                <div
                  style={{
                    backgroundColor: '#e2e8f0',
                    padding: '16px',
                    borderRadius: '16px',
                    overflowX: 'auto',
                    boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    id="resume-pdf-canvas"
                    ref={previewRef}
                    style={{
                      width: '100%',
                      maxWidth: '800px',
                      margin: '0 auto',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      minHeight: '980px',
                    }}
                  >
                    {selectedTemplate === 'modern' && <ModernTemplate data={resumeData} />}
                    {selectedTemplate === 'classic' && <ClassicTemplate data={resumeData} />}
                    {selectedTemplate === 'minimalist' && <MinimalistTemplate data={resumeData} />}
                    {selectedTemplate === 'creative' && <CreativeTemplate data={resumeData} />}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
