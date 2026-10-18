const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Python', 'Java', 'C++', 'DSA', 'DBMS', 'HR', 'FULLSTACK']
  },
  questionText: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  sampleAnswer: {
    type: String,
    default: ''
  },
  keywords: {
    type: [String],
    default: []
  },
  maxScore: {
    type: Number,
    default: 10
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
