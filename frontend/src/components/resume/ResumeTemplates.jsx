import React from 'react';

/**
 * Modern Tech Template (Navy Header, Blue Accents, Clean Grid)
 */
export const ModernTemplate = ({ data }) => {
  const { personalInfo = {}, summary = '', skills = {}, education = [], experience = [], projects = [], certifications = [], achievements = [] } = data;

  return (
    <div className="resume-sheet modern-template" style={{ backgroundColor: '#ffffff', color: '#1e293b', fontFamily: 'inherit', padding: '32px 36px', lineHeight: 1.45, fontSize: '13px' }}>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #2563eb', paddingBottom: '14px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0 }}>
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', marginTop: '2px' }}>
          {data.targetRole || 'Software Engineer'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '11.5px', color: '#475569', marginTop: '8px' }}>
          {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.linkedin && (
            <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>
              🔗 LinkedIn
            </a>
          )}
          {personalInfo.github && (
            <a href={personalInfo.github} target="_blank" rel="noreferrer" style={{ color: '#0f172a' }}>
              💻 GitHub
            </a>
          )}
          {personalInfo.portfolio && (
            <a href={personalInfo.portfolio} target="_blank" rel="noreferrer" style={{ color: '#7c3aed' }}>
              🌐 Portfolio
            </a>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px' }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, color: '#334155', fontSize: '12px', lineHeight: 1.55 }}>{summary}</p>
        </div>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
            Technical Competencies
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
            {skills.technical?.length > 0 && (
              <div>
                <strong style={{ color: '#0f172a' }}>Programming Languages:</strong>{' '}
                <span style={{ color: '#334155' }}>{skills.technical.join(', ')}</span>
              </div>
            )}
            {skills.frameworks?.length > 0 && (
              <div>
                <strong style={{ color: '#0f172a' }}>Frameworks & Libraries:</strong>{' '}
                <span style={{ color: '#334155' }}>{skills.frameworks.join(', ')}</span>
              </div>
            )}
            {skills.tools?.length > 0 && (
              <div>
                <strong style={{ color: '#0f172a' }}>Tools & Databases:</strong>{' '}
                <span style={{ color: '#334155' }}>{skills.tools.join(', ')}</span>
              </div>
            )}
            {skills.soft?.length > 0 && (
              <div>
                <strong style={{ color: '#0f172a' }}>Core Strengths:</strong>{' '}
                <span style={{ color: '#334155' }}>{skills.soft.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
            Key Technical Projects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {projects.map((proj, idx) => (
              <div key={proj.id || idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {proj.title}{' '}
                    {proj.techStack?.length > 0 && (
                      <span style={{ fontWeight: 500, fontSize: '11px', color: '#2563eb' }}>
                        | {proj.techStack.join(', ')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {proj.githubUrl && <span>Code Available</span>}
                  </div>
                </div>
                {proj.description && (
                  <p style={{ margin: '2px 0 4px', fontSize: '11.5px', color: '#475569' }}>
                    {proj.description}
                  </p>
                )}
                {proj.highlights?.length > 0 && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: '16px', fontSize: '11.5px', color: '#334155' }}>
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ marginBottom: '2px', lineHeight: 1.45 }}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience / Internships */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
            Work Experience & Internships
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {experience.map((exp, idx) => (
              <div key={exp.id || idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                    {exp.role} <span style={{ fontWeight: 500, color: '#475569' }}>at {exp.company}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate || '2024'}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ margin: '2px 0 4px', fontSize: '11.5px', color: '#475569' }}>{exp.description}</p>
                )}
                {exp.highlights?.length > 0 && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: '16px', fontSize: '11.5px', color: '#334155' }}>
                    {exp.highlights.map((h, hIdx) => (
                      <li key={hIdx} style={{ marginBottom: '2px', lineHeight: 1.45 }}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '8px' }}>
            Education
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {education.map((edu, idx) => (
              <div key={edu.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>
                    {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#475569' }}>
                    {edu.institution} {edu.location && `• ${edu.location}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 600, color: '#0f172a' }}>
                    {edu.grade && `Score: ${edu.grade}`}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements in 2-column footer */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: certifications.length > 0 && achievements.length > 0 ? '1fr 1fr' : '1fr', gap: '16px' }}>
          {certifications.length > 0 && (
            <div>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '6px' }}>
                Certifications
              </h2>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: '#334155' }}>
                {certifications.map((c, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>
                    <strong>{c.name}</strong> {c.issuer && `(${c.issuer})`} {c.issueDate && `• ${c.issueDate}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <h2 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '3px', marginBottom: '6px' }}>
                Key Achievements
              </h2>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: '#334155' }}>
                {achievements.map((a, i) => (
                  <li key={i} style={{ marginBottom: '2px' }}>
                    <strong>{a.title}</strong> {a.description && `- ${a.description}`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Classic Ivy / Academic Template (Traditional Serif, Centered Header, Maximum ATS Compatibility)
 */
export const ClassicTemplate = ({ data }) => {
  const { personalInfo = {}, summary = '', skills = {}, education = [], experience = [], projects = [], certifications = [], achievements = [] } = data;

  return (
    <div className="resume-sheet classic-template" style={{ backgroundColor: '#ffffff', color: '#111827', fontFamily: 'Georgia, Cambria, serif', padding: '36px 40px', lineHeight: 1.5, fontSize: '12.5px' }}>
      {/* Centered Header */}
      <div style={{ textAlign: 'center', borderBottom: '1.5px solid #111827', paddingBottom: '12px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, color: '#111827' }}>
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <div style={{ fontSize: '13px', fontStyle: 'italic', color: '#374151', marginTop: '2px' }}>
          {data.targetRole || 'Software Engineer Candidate'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', fontSize: '11.5px', color: '#374151', marginTop: '6px' }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• LinkedIn</span>}
          {personalInfo.github && <span>• GitHub</span>}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px' }}>
            Professional Summary
          </h2>
          <p style={{ margin: 0, fontSize: '12px', textAlign: 'justify' }}>{summary}</p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px' }}>
            Education
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12.5px' }}>
                <span>{edu.institution}</span>
                <span>{edu.startDate} – {edu.endDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', fontSize: '12px', color: '#374151' }}>
                <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                <span>{edu.grade && `Cumulative Grade: ${edu.grade}`}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {(skills.technical?.length > 0 || skills.frameworks?.length > 0) && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px' }}>
            Technical Skills
          </h2>
          <div style={{ fontSize: '12px' }}>
            {skills.technical?.length > 0 && <div><strong>Languages & Core:</strong> {skills.technical.join(', ')}</div>}
            {skills.frameworks?.length > 0 && <div><strong>Frameworks & Libraries:</strong> {skills.frameworks.join(', ')}</div>}
            {skills.tools?.length > 0 && <div><strong>Developer Tools & Databases:</strong> {skills.tools.join(', ')}</div>}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px' }}>
            Professional Experience
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12.5px' }}>
                <span>{exp.role} – {exp.company}</span>
                <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {exp.highlights?.length > 0 && (
                <ul style={{ margin: '4px 0 0', paddingLeft: '18px', fontSize: '12px' }}>
                  {exp.highlights.map((h, i) => (
                    <li key={i} style={{ marginBottom: '2px' }}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '12.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px' }}>
            Technical Projects
          </h2>
          {projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '12.5px' }}>
                <span>{proj.title} {proj.techStack?.length > 0 && <span style={{ fontStyle: 'italic', fontWeight: 'normal', color: '#4b5563' }}>({proj.techStack.join(', ')})</span>}</span>
              </div>
              {proj.highlights?.length > 0 && (
                <ul style={{ margin: '4px 0 0', paddingLeft: '18px', fontSize: '12px' }}>
                  {proj.highlights.map((h, i) => (
                    <li key={i} style={{ marginBottom: '2px' }}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div>
          <h2 style={{ fontSize: '12.5px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #9ca3af', paddingBottom: '2px', marginBottom: '6px' }}>
            Honors, Certifications & Achievements
          </h2>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px' }}>
            {certifications.map((c, i) => (
              <li key={`c-${i}`}><strong>{c.name}</strong> {c.issuer && `(${c.issuer})`}</li>
            ))}
            {achievements.map((a, i) => (
              <li key={`a-${i}`}><strong>{a.title}</strong> {a.description && `– ${a.description}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Minimalist Professional Template (Clean Sans-Serif, Elegant Thin Lines)
 */
export const MinimalistTemplate = ({ data }) => {
  const { personalInfo = {}, summary = '', skills = {}, education = [], experience = [], projects = [], certifications = [], achievements = [] } = data;

  return (
    <div className="resume-sheet minimalist-template" style={{ backgroundColor: '#ffffff', color: '#18181b', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '34px 38px', lineHeight: 1.5, fontSize: '12.5px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e4e4e7', paddingBottom: '16px', marginBottom: '18px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#09090b', letterSpacing: '-0.03em', margin: 0 }}>
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#71717a', marginTop: '2px' }}>
            {data.targetRole || 'Software Development Engineer'}
          </div>
        </div>
        <div style={{ textAlign: 'right', fontSize: '11px', color: '#52525b', lineHeight: 1.6 }}>
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.github && <div>{personalInfo.github}</div>}
        </div>
      </div>

      {summary && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#3f3f46', lineHeight: 1.6 }}>{summary}</p>
        </div>
      )}

      {/* Skills Bar */}
      {(skills.technical?.length > 0 || skills.frameworks?.length > 0) && (
        <div style={{ marginBottom: '16px', backgroundColor: '#fafafa', padding: '10px 14px', borderRadius: '6px', border: '1px solid #f4f4f5' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#09090b', marginBottom: '4px' }}>
            Technical Expertise
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {[...(skills.technical || []), ...(skills.frameworks || []), ...(skills.tools || [])].map((sk, i) => (
              <span key={i} style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', padding: '2px 7px', borderRadius: '4px', fontSize: '11px', fontWeight: 500, color: '#27272a' }}>
                {sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', marginBottom: '8px' }}>
            Experience
          </div>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: 700, color: '#09090b' }}>{exp.role}</span>
                <span style={{ fontSize: '11px', color: '#a1a1aa' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '4px' }}>{exp.company} • {exp.location || 'Remote'}</div>
              {exp.highlights?.map((h, i) => (
                <div key={i} style={{ fontSize: '11.5px', color: '#3f3f46', paddingLeft: '10px', borderLeft: '2px solid #e4e4e7', marginBottom: '3px' }}>
                  {h}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', marginBottom: '8px' }}>
            Featured Projects
          </div>
          {projects.map((proj, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ fontWeight: 700, color: '#09090b' }}>{proj.title}</span>
                <span style={{ fontSize: '11px', color: '#2563eb' }}>{proj.techStack?.slice(0, 3).join(', ')}</span>
              </div>
              {proj.highlights?.map((h, i) => (
                <div key={i} style={{ fontSize: '11.5px', color: '#3f3f46', paddingLeft: '10px', borderLeft: '2px solid #e4e4e7', marginBottom: '3px' }}>
                  {h}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', marginBottom: '8px' }}>
            Education
          </div>
          {education.map((edu, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#09090b', fontSize: '12.5px' }}>{edu.degree}</div>
                <div style={{ fontSize: '11.5px', color: '#71717a' }}>{edu.institution} {edu.grade && `• ${edu.grade}`}</div>
              </div>
              <div style={{ fontSize: '11px', color: '#a1a1aa' }}>{edu.startDate} – {edu.endDate}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Creative AI & Tech Template (Purple/Navy Banner, Metrics & Competencies)
 */
export const CreativeTemplate = ({ data }) => {
  const { personalInfo = {}, summary = '', skills = {}, education = [], experience = [], projects = [], certifications = [], achievements = [] } = data;

  return (
    <div className="resume-sheet creative-template" style={{ backgroundColor: '#ffffff', color: '#1e1b4b', fontFamily: 'inherit', padding: '0', lineHeight: 1.45, fontSize: '12.5px', overflow: 'hidden' }}>
      {/* Gradient Top Banner */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #4338ca 100%)', color: '#ffffff', padding: '28px 36px 20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#ffffff' }}>
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#a5b4fc', marginTop: '4px' }}>
          {data.targetRole || 'AI / Machine Learning & Software Engineer'}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '11px', color: '#e0e7ff', marginTop: '10px' }}>
          {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
          {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
          {personalInfo.location && <span>📍 {personalInfo.location}</span>}
          {personalInfo.github && <span>💻 {personalInfo.github.replace('https://', '')}</span>}
        </div>
      </div>

      <div style={{ padding: '24px 36px 32px' }}>
        {/* Summary */}
        {summary && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#4338ca', letterSpacing: '0.06em', marginBottom: '6px' }}>
              // Executive Overview
            </h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: 1.6 }}>{summary}</p>
          </div>
        )}

        {/* Skills Pills */}
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#4338ca', letterSpacing: '0.06em', marginBottom: '8px' }}>
            // Core Competencies & Toolchain
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '11.5px' }}>
            {skills.technical?.length > 0 && (
              <div style={{ backgroundColor: '#f5f3ff', border: '1px solid #ede9fe', borderRadius: '6px', padding: '6px 10px' }}>
                <strong style={{ color: '#4338ca', display: 'block', marginBottom: '2px' }}>Languages</strong>
                <span style={{ color: '#475569' }}>{skills.technical.join(', ')}</span>
              </div>
            )}
            {skills.frameworks?.length > 0 && (
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '6px', padding: '6px 10px' }}>
                <strong style={{ color: '#2563eb', display: 'block', marginBottom: '2px' }}>Frameworks & ML</strong>
                <span style={{ color: '#475569' }}>{skills.frameworks.join(', ')}</span>
              </div>
            )}
            {skills.tools?.length > 0 && (
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '6px 10px' }}>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '2px' }}>Platforms & Tools</strong>
                <span style={{ color: '#475569' }}>{skills.tools.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Projects */}
        {projects.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#4338ca', letterSpacing: '0.06em', marginBottom: '8px' }}>
              // Engineered Projects & Deployments
            </h2>
            {projects.map((proj, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{proj.title}</span>
                  <span style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 600 }}>{proj.techStack?.join(' • ')}</span>
                </div>
                {proj.highlights?.length > 0 && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: '16px', fontSize: '11.5px', color: '#334155' }}>
                    {proj.highlights.map((h, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#4338ca', letterSpacing: '0.06em', marginBottom: '8px' }}>
              // Professional Experience
            </h2>
            {experience.map((exp, idx) => (
              <div key={idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>{exp.role} @ {exp.company}</span>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.highlights?.length > 0 && (
                  <ul style={{ margin: '3px 0 0', paddingLeft: '16px', fontSize: '11.5px', color: '#334155' }}>
                    {exp.highlights.map((h, i) => (
                      <li key={i} style={{ marginBottom: '2px' }}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education & Honors */}
        {education.length > 0 && (
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#4338ca', letterSpacing: '0.06em', marginBottom: '8px' }}>
              // Education & Credentials
            </h2>
            {education.map((edu, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <div>
                  <strong style={{ color: '#0f172a' }}>{edu.degree}</strong> ({edu.institution})
                </div>
                <div style={{ color: '#4f46e5', fontWeight: 600 }}>{edu.grade} • {edu.startDate}-{edu.endDate}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
