const mongoose = require('mongoose');

const educationItemSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  grade: { type: String, default: '' },
  location: { type: String, default: '' },
});

const experienceItemSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  role: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
});

const projectItemSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, default: '' },
  techStack: [{ type: String }],
  liveUrl: { type: String, default: '' },
  githubUrl: { type: String, default: '' },
  description: { type: String, default: '' },
  highlights: [{ type: String }],
});

const certificationItemSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  issueDate: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
});

const achievementItemSchema = new mongoose.Schema({
  id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
});

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'My Professional Resume',
    },
    targetRole: {
      type: String,
      default: 'Software Engineer',
    },
    template: {
      type: String,
      default: 'modern',
      enum: ['modern', 'classic', 'minimalist', 'creative'],
    },
    personalInfo: {
      fullName: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    summary: {
      type: String,
      default: '',
    },
    skills: {
      technical: [{ type: String }],
      frameworks: [{ type: String }],
      tools: [{ type: String }],
      soft: [{ type: String }],
    },
    education: [educationItemSchema],
    experience: [experienceItemSchema],
    projects: [projectItemSchema],
    certifications: [certificationItemSchema],
    achievements: [achievementItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resume', resumeSchema);
