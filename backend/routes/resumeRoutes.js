const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Resume = require('../models/Resume');
const { protect } = require('../middleware/authMiddleware');
const { extractTextFromBuffer, parseResumeData } = require('../services/resumeParserService');
const { enhanceResumeWithAI } = require('../services/resumeEnhanceService');
const memoryStore = require('../utils/memoryStore');

// Multer memory storage configuration (max 5MB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'text/plain' ||
      file.originalname.match(/\.(pdf|txt|docx?)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and TXT documents are supported'));
    }
  },
});

// In-memory fallback resumes store when MongoDB is offline
const inMemoryResumes = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * Helper to build a clean default resume populated with candidate's profile
 */
const getDefaultResume = (user) => {
  const candidateName = user?.fullName || user?.name || 'Candidate';
  return {
    title: `${candidateName}'s Technical Resume`,
    targetRole: 'Software Engineer',
    template: 'modern',
    personalInfo: {
      fullName: candidateName,
      email: user?.email || 'candidate@college.edu',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      linkedin: 'https://linkedin.com/in/candidate',
      github: 'https://github.com/candidate',
      portfolio: '',
    },
    summary: `Motivated Computer Science & Engineering student specializing in AI & Data Science with hands-on expertise in full-stack web applications, algorithmic problem solving, and modern development frameworks. Proven ability to design scalable REST APIs, optimize front-end user experiences, and collaborate within agile teams.`,
    skills: {
      technical: ['Python', 'Java', 'C++', 'JavaScript (ES6+)', 'SQL', 'Data Structures & Algorithms'],
      frameworks: ['React.js', 'Node.js', 'Express.js', 'Tailwind CSS', 'FastAPI'],
      tools: ['Git', 'GitHub', 'MongoDB', 'PostgreSQL', 'Docker', 'Postman', 'VS Code'],
      soft: ['Critical Thinking', 'Agile Teamwork', 'Problem Solving', 'Adaptability', 'Technical Documentation'],
    },
    education: [
      {
        id: 'edu-1',
        institution: 'National Institute of Technology',
        degree: 'B.Tech in Computer Science & Engineering',
        fieldOfStudy: 'AI & Data Science',
        startDate: '2022',
        endDate: '2026',
        grade: '8.8 CGPA',
        location: 'Campus',
      },
      {
        id: 'edu-2',
        institution: 'Senior Secondary High School',
        degree: 'Higher Secondary Education (Class XII - PCM & CS)',
        fieldOfStudy: 'Science with Computer Science',
        startDate: '2020',
        endDate: '2022',
        grade: '94.2%',
        location: 'State Board',
      },
    ],
    experience: [
      {
        id: 'exp-1',
        role: 'Full Stack Development Intern',
        company: 'NextGen Cloud Solutions',
        location: 'Hybrid',
        startDate: 'May 2024',
        endDate: 'July 2024',
        current: false,
        description: 'Engineered dashboard modules and optimized API response times.',
        highlights: [
          'Built 8+ reusable React components adhering to clean architecture, reducing UI bundle load by 18%.',
          'Refactored Node.js & Express REST endpoints with JWT authorization and MongoDB indexing.',
          'Collaborated with senior engineers in sprint planning and peer code reviews.'
        ],
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'AI Interview Preparation & Assessment System',
        techStack: ['React.js', 'Node.js', 'Express', 'MongoDB'],
        liveUrl: 'http://localhost:5173',
        githubUrl: 'https://github.com/candidate/ai-interview-prep',
        description: 'End-to-end placement readiness system providing automated interview feedback and technical scoring.',
        highlights: [
          'Architected modern single-page application with 7 technical tracks (Python, Java, C++, DSA, DBMS, HR, Fullstack).',
          'Implemented AI evaluation alongside an intelligent offline fallback heuristic engine.',
          'Integrated real-time speech dictation and dynamic performance metric dashboards.'
        ],
      },
      {
        id: 'proj-2',
        title: 'Automated Resume Builder & Career Engine',
        techStack: ['React.js', 'Vite', 'HTML5', 'CSS3', 'html2pdf.js'],
        liveUrl: '',
        githubUrl: 'https://github.com/candidate/resume-builder',
        description: 'Interactive resume generator supporting 4 professional templates, PDF compilation, and role tailoring.',
        highlights: [
          'Engineered responsive live preview system rendering instant layout transitions across 4 tailored styling templates.',
          'Implemented document text extraction and action-verb enhancement for targeted engineering job profiles.'
        ],
      },
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'Full Stack Web Development Professional',
        issuer: 'Meta / Coursera',
        issueDate: '2024',
        credentialUrl: '',
      },
    ],
    achievements: [
      {
        id: 'ach-1',
        title: 'Top 5 Finalist - National College Hackathon 2024',
        description: 'Developed an AI accessibility tool within 36 hours.',
      },
      {
        id: 'ach-2',
        title: 'Solved 350+ Problems on LeetCode & CodeChef',
        description: 'Ranked in top 15% globally in algorithmic data structure contests.',
      },
    ],
  };
};

/**
 * @route   GET /api/resumes
 * @desc    Get all resumes for authenticated user
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    let resumes = [];
    if (isDbConnected()) {
      resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    } else {
      resumes = inMemoryResumes.filter((r) => String(r.user) === String(req.user._id));
    }

    return res.json({
      success: true,
      count: resumes.length,
      resumes,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/resumes/latest
 * @desc    Get latest resume for authenticated user, or returns starter template
 * @access  Private
 */
router.get('/latest', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let latestResume = null;
    if (isDbConnected()) {
      latestResume = await Resume.findOne({ user: userId }).sort({ updatedAt: -1 });
    } else {
      latestResume = await memoryStore.getUserResume(userId);
    }

    if (!latestResume) {
      const defaultData = getDefaultResume(req.user);
      return res.json({
        success: true,
        isNew: true,
        resume: {
          ...defaultData,
          user: userId,
        },
      });
    }

    return res.json({
      success: true,
      isNew: false,
      resume: latestResume,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/resumes/:id
 * @desc    Get resume by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    let resume = null;

    if (isDbConnected()) {
      resume = await Resume.findOne({ _id: id, user: req.user._id });
    } else {
      resume = inMemoryResumes.find((r) => r._id === id);
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    return res.json({ success: true, resume });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/resumes
 * @desc    Save or update a resume
 * @access  Private
 */
router.post('/', protect, async (req, res) => {
  try {
    const resumeData = req.body;
    const userId = req.user._id;

    if (isDbConnected()) {
      let savedResume;
      if (resumeData._id && String(resumeData._id).length === 24) {
        savedResume = await Resume.findOneAndUpdate(
          { _id: resumeData._id, user: userId },
          { ...resumeData, user: userId },
          { new: true, upsert: true }
        );
      } else {
        const existing = await Resume.findOne({ user: userId });
        if (existing) {
          savedResume = await Resume.findByIdAndUpdate(
            existing._id,
            { ...resumeData, user: userId },
            { new: true }
          );
        } else {
          savedResume = await Resume.create({ ...resumeData, user: userId });
        }
      }

      return res.json({
        success: true,
        message: 'Resume saved successfully to database!',
        resume: savedResume,
      });
    } else {
      const savedResume = await memoryStore.saveUserResume(resumeData, userId);

      return res.json({
        success: true,
        message: 'Resume saved (Session Mode)!',
        resume: savedResume,
      });
    }
  } catch (error) {
    console.error('Save Resume Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/resumes/upload-parse
 * @desc    Upload existing resume (PDF/TXT) and parse structured fields
 * @access  Private
 */
router.post('/upload-parse', protect, upload.single('resumeFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or TXT file' });
    }

    const rawText = await extractTextFromBuffer(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    );

    if (!rawText || rawText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract readable text from the uploaded file.',
      });
    }

    const parseResult = await parseResumeData(rawText);

    return res.json({
      success: true,
      message: 'Resume parsed and data extracted successfully!',
      source: parseResult.source,
      extractedData: parseResult.data,
      rawTextSnippet: rawText.slice(0, 300) + '...',
    });
  } catch (error) {
    console.error('Resume Parse Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to parse resume document.',
    });
  }
});

/**
 * @route   POST /api/resumes/parse-text
 * @desc    Parse pasted raw resume text
 * @access  Private
 */
router.post('/parse-text', protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least a few lines of resume text.',
      });
    }

    const parseResult = await parseResumeData(text);

    return res.json({
      success: true,
      message: 'Text parsed successfully!',
      source: parseResult.source,
      extractedData: parseResult.data,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/resumes/enhance
 * @desc    AI / Smart role-tailored enhancement for summary, skills, and bullet points
 * @access  Private
 */
router.post('/enhance', protect, async (req, res) => {
  try {
    const { resumeData, targetRole = 'Software Engineer' } = req.body;

    if (!resumeData) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const enhanced = await enhanceResumeWithAI(resumeData, targetRole);

    return res.json({
      success: true,
      message: `Resume successfully optimized for "${targetRole}"!`,
      enhancedResume: enhanced,
    });
  } catch (error) {
    console.error('Enhance Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/resumes/:id
 * @desc    Delete a resume
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    if (isDbConnected()) {
      await Resume.findOneAndDelete({ _id: id, user: req.user._id });
    } else {
      const idx = inMemoryResumes.findIndex((r) => r._id === id);
      if (idx !== -1) inMemoryResumes.splice(idx, 1);
    }

    return res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
