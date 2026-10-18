const express = require('express');
const router = express.Router();
const Interview = require('../models/Interview');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// Demo evaluation function - used when OpenAI key is not configured
const evaluateAnswerDemo = (question, userAnswer) => {
  const maxScore = (question && typeof question.maxScore === 'number' && question.maxScore > 0) ? question.maxScore : 10;

  if (!userAnswer || typeof userAnswer !== 'string' || userAnswer.trim().length === 0) {
    return {
      score: 0,
      maxScore,
      feedback: 'No answer provided. Please attempt the question to receive marks.',
      strengths: [],
      improvements: ['Attempt every question', 'Provide clear definitions and examples'],
      method: 'demo'
    };
  }

  const answer = userAnswer.toLowerCase();
  const keywords = (question && Array.isArray(question.keywords)) ? question.keywords : [];
  const sampleAnswer = ((question && question.sampleAnswer) || '').toLowerCase();

  // Smart keyword matching (handles multi-word keywords and variations)
  let matchedKeywords = keywords.filter(kw => {
    const kwLower = kw.toLowerCase();
    if (answer.includes(kwLower)) return true;
    const parts = kwLower.split(/[\s-]+/);
    return parts.some(p => p.length >= 4 && answer.includes(p));
  });

  const keywordRatio = keywords.length > 0 ? (matchedKeywords.length / keywords.length) : 0.6;

  // Word count & depth evaluation
  const words = userAnswer.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  let lengthScore = 0.4;
  if (wordCount >= 45) lengthScore = 1.0;
  else if (wordCount >= 25) lengthScore = 0.85;
  else if (wordCount >= 12) lengthScore = 0.65;
  else if (wordCount >= 5) lengthScore = 0.45;
  else lengthScore = 0.2;

  // Sample answer conceptual overlap
  const sampleTokens = sampleAnswer.split(/[^a-zA-Z0-9]+/).filter(t => t.length > 4);
  const matchedTokens = sampleTokens.filter(t => answer.includes(t));
  const tokenRatio = sampleTokens.length > 0 ? (matchedTokens.length / sampleTokens.length) : 0.5;

  // Calculate composite score (0.0 to 1.0)
  const composite = (keywordRatio * 0.45) + (tokenRatio * 0.25) + (lengthScore * 0.30);
  let rawScore = Math.round(composite * maxScore);

  // Generous floor for thorough answers (e.g. from documentation, Google, or good preparation)
  if (wordCount >= 30 && matchedKeywords.length >= 1) {
    rawScore = Math.max(rawScore, 8);
  } else if (wordCount >= 15 && matchedKeywords.length >= 1) {
    rawScore = Math.max(rawScore, 7);
  } else if (wordCount >= 10) {
    rawScore = Math.max(rawScore, 5);
  } else if (wordCount >= 3) {
    rawScore = Math.max(rawScore, 3);
  }

  const safeScore = isNaN(rawScore) ? 7 : Math.max(1, Math.min(rawScore, maxScore));

  let feedback, strengths = [], improvements = [];

  if (safeScore >= 8) {
    feedback = `Outstanding answer! You covered key concepts clearly (${matchedKeywords.length > 0 ? matchedKeywords.slice(0, 3).join(', ') : 'strong technical depth'}). Well structured!`;
    strengths = ['Accurate technical terminology', 'Comprehensive explanation', 'Good depth of knowledge'];
    const missing = keywords.filter(k => !answer.includes(k.toLowerCase())).slice(0, 2);
    if (missing.length > 0) improvements = [`Optionally add more on: ${missing.join(', ')}`];
  } else if (safeScore >= 6) {
    feedback = `Solid response! You showed good understanding of the topic with relevant points covered.`;
    strengths = ['Good foundational knowledge', 'Relevant concepts mentioned'];
    const missing = keywords.filter(k => !answer.includes(k.toLowerCase())).slice(0, 2);
    improvements = missing.length > 0 ? [`Consider elaborating on: ${missing.join(', ')}`, 'Add concrete real-world examples'] : ['Include practical code or architecture examples'];
  } else if (safeScore >= 4) {
    feedback = `Decent attempt. You touched on the topic, but the response could benefit from more technical details.`;
    strengths = ['Attempted the question', 'Basic concept identified'];
    improvements = ['Explain key definitions in more detail', 'Study core terms: ' + keywords.slice(0, 3).join(', ')];
  } else {
    feedback = `The answer is too brief or missed the main concepts. Review this topic to strengthen your response.`;
    strengths = ['Attempted response'];
    improvements = ['Review topic fundamentals', 'Key terms to include: ' + keywords.slice(0, 4).join(', ')];
  }

  return { score: safeScore, maxScore, feedback, strengths, improvements, method: 'demo' };
};

// OpenAI evaluation function
const evaluateAnswerWithAI = async (question, userAnswer) => {
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `You are an expert technical interviewer. Evaluate the following interview answer.

Question: ${question.questionText}
Category: ${question.category}
Max Score: ${question.maxScore}

User's Answer: ${userAnswer}

Sample Answer Reference: ${question.sampleAnswer}

Please evaluate and respond with a JSON object in this exact format:
{
  "score": <number between 0 and ${question.maxScore}>,
  "feedback": "<detailed feedback in 2-3 sentences>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<area to improve 1>", "<area to improve 2>"]
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const result = JSON.parse(jsonMatch[0]);
    return {
      score: Math.max(0, Math.min(Math.round(result.score), question.maxScore)),
      feedback: result.feedback || 'AI feedback not available.',
      strengths: result.strengths || [],
      improvements: result.improvements || [],
      method: 'openai'
    };
  } catch (error) {
    console.error('OpenAI evaluation failed, falling back to demo:', error.message);
    return evaluateAnswerDemo(question, userAnswer);
  }
};

// @route   POST /api/interviews/submit
// @desc    Submit interview answers and get results
router.post('/submit', protect, async (req, res) => {
  try {
    const { category, answers, duration } = req.body;

    if (!category || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Invalid interview data.' });
    }

    const useOpenAI = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'sk-your-openai-api-key-here');
    const evaluationMethod = useOpenAI ? 'openai' : 'demo';

    // Evaluate each answer
    const evaluatedAnswers = [];
    let totalScore = 0;
    let maxPossibleScore = 0;
    const allStrengths = [];
    const allImprovements = [];

    for (const ans of answers) {
      let evaluation;
      if (useOpenAI) {
        evaluation = await evaluateAnswerWithAI(ans.question, ans.userAnswer);
      } else {
        evaluation = evaluateAnswerDemo(ans.question, ans.userAnswer);
      }

      evaluatedAnswers.push({
        questionId: ans.question._id || null,
        questionText: ans.question.questionText,
        userAnswer: ans.userAnswer,
        score: evaluation.score,
        maxScore: ans.question.maxScore || 10,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        evaluationMethod: evaluation.method
      });

      const ansScore = (typeof evaluation.score === 'number' && !isNaN(evaluation.score)) ? evaluation.score : 5;
      const ansMax = (ans.question && typeof ans.question.maxScore === 'number' && ans.question.maxScore > 0) ? ans.question.maxScore : 10;
      totalScore += ansScore;
      maxPossibleScore += ansMax;
      allStrengths.push(...evaluation.strengths);
      allImprovements.push(...evaluation.improvements);
    }

    const safeTotal = isNaN(totalScore) ? 0 : totalScore;
    const safeMax = (isNaN(maxPossibleScore) || maxPossibleScore === 0) ? 50 : maxPossibleScore;
    const percentage = Math.max(0, Math.min(100, Math.round((safeTotal / safeMax) * 100)));

    // Generate overall feedback
    let overallFeedback;
    if (percentage >= 80) overallFeedback = `Outstanding performance! You scored ${percentage}% in ${category}. You have a strong grasp of the concepts.`;
    else if (percentage >= 60) overallFeedback = `Good job! You scored ${percentage}% in ${category}. A bit more practice will make you excellent.`;
    else if (percentage >= 40) overallFeedback = `Fair performance. You scored ${percentage}% in ${category}. Focus on the improvement areas and try again.`;
    else overallFeedback = `You scored ${percentage}% in ${category}. Don't be discouraged - review the topics and practice more!`;

    // Remove duplicates
    const uniqueStrengths = [...new Set(allStrengths)].slice(0, 4);
    const uniqueImprovements = [...new Set(allImprovements)].slice(0, 4);

    // Save interview
    let interview;
    const mongoose = require('mongoose');
    const memoryStore = require('../utils/memoryStore');

    if (mongoose.connection.readyState === 1) {
      interview = await Interview.create({
        userId: req.user._id,
        category,
        answers: evaluatedAnswers,
        totalScore,
        maxPossibleScore,
        percentage,
        status: 'completed',
        duration: duration || 0,
        overallFeedback,
        strengths: uniqueStrengths,
        areasForImprovement: uniqueImprovements,
        evaluationMethod,
        completedAt: new Date()
      });

      // Update user stats
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalInterviews: 1, totalPracticeTime: duration || 0 }
      });
    } else {
      interview = await memoryStore.saveInterview({
        userId: req.user._id || req.user.id,
        category,
        answers: evaluatedAnswers,
        totalScore,
        maxPossibleScore,
        percentage,
        status: 'completed',
        duration: duration || 0,
        overallFeedback,
        strengths: uniqueStrengths,
        areasForImprovement: uniqueImprovements,
        evaluationMethod
      });
    }

    res.status(201).json({
      success: true,
      message: 'Interview submitted and evaluated successfully!',
      interview,
      evaluationMode: useOpenAI ? '🤖 Real AI (OpenAI GPT)' : '📊 Demo Evaluation (Pattern Matching)'
    });
  } catch (error) {
    console.error('Submit interview error:', error);
    res.status(500).json({ success: false, message: 'Error evaluating interview. Please try again.' });
  }
});

// @route   GET /api/interviews/history
// @desc    Get user's interview history
router.get('/history', protect, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const memoryStore = require('../utils/memoryStore');
    let interviews;

    if (mongoose.connection.readyState === 1) {
      interviews = await Interview.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .select('-answers');
    } else {
      interviews = await memoryStore.getUserInterviews(req.user._id || req.user.id);
    }

    res.json({ success: true, interviews, count: interviews.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/interviews/stats
// @desc    Get user's dashboard statistics
router.get('/stats', protect, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const memoryStore = require('../utils/memoryStore');
    let interviews;

    if (mongoose.connection.readyState === 1) {
      interviews = await Interview.find({ userId: req.user._id, status: 'completed' });
    } else {
      interviews = await memoryStore.getUserInterviews(req.user._id || req.user.id);
    }

    if (!interviews || interviews.length === 0) {
      return res.json({
        success: true,
        stats: { totalInterviews: 0, averageScore: 0, bestScore: 0, totalPracticeTime: 0, categoryBreakdown: {} }
      });
    }

    const totalInterviews = interviews.length;
    const averageScore = Math.round(interviews.reduce((sum, i) => sum + i.percentage, 0) / totalInterviews);
    const bestScore = Math.max(...interviews.map(i => i.percentage));
    const totalPracticeTime = interviews.reduce((sum, i) => sum + (i.duration || 0), 0);

    // Category breakdown
    const categoryBreakdown = {};
    interviews.forEach(interview => {
      if (!categoryBreakdown[interview.category]) {
        categoryBreakdown[interview.category] = { count: 0, totalScore: 0, avgScore: 0 };
      }
      categoryBreakdown[interview.category].count++;
      categoryBreakdown[interview.category].totalScore += interview.percentage;
    });
    Object.keys(categoryBreakdown).forEach(cat => {
      categoryBreakdown[cat].avgScore = Math.round(categoryBreakdown[cat].totalScore / categoryBreakdown[cat].count);
    });

    res.json({
      success: true,
      stats: { totalInterviews, averageScore, bestScore, totalPracticeTime, categoryBreakdown }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/interviews/:id
// @desc    Get single interview result
router.get('/:id', protect, async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const memoryStore = require('../utils/memoryStore');
    let interview;

    if (mongoose.connection.readyState === 1) {
      interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    } else {
      interview = await memoryStore.getInterviewById(req.params.id, req.user._id || req.user.id);
    }

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }
    res.json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
