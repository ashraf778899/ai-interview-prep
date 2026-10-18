const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  questionText: String,
  userAnswer: String,
  score: { type: Number, default: 0 },
  maxScore: { type: Number, default: 10 },
  feedback: String,
  strengths: [String],
  improvements: [String],
  evaluationMethod: { type: String, enum: ['openai', 'demo'], default: 'demo' }
});

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Python', 'Java', 'C++', 'DSA', 'DBMS', 'HR', 'FULLSTACK']
  },
  answers: [answerSchema],
  totalScore: { type: Number, default: 0 },
  maxPossibleScore: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['in-progress', 'completed'],
    default: 'completed'
  },
  duration: { type: Number, default: 0 },
  overallFeedback: { type: String, default: '' },
  strengths: [String],
  areasForImprovement: [String],
  evaluationMethod: { type: String, enum: ['openai', 'demo'], default: 'demo' },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Interview', interviewSchema);
