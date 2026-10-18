const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const memoryStore = require('../utils/memoryStore');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/users/profile
// @desc    Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { fullName, email } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      // Check if email is taken by another user
      const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already in use by another account.' });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { fullName, email: email.toLowerCase() },
        { new: true, runValidators: true }
      );

      return res.json({ success: true, message: 'Profile updated successfully!', user });
    } else {
      // In-memory update
      const user = await memoryStore.findUserById(req.user._id || req.user.id);
      if (user) {
        user.fullName = fullName;
        user.email = email.toLowerCase();
      }
      return res.json({ success: true, message: 'Profile updated successfully!', user: user || req.user });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.user._id).select('+password');
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }

      user.password = newPassword;
      await user.save();

      return res.json({ success: true, message: 'Password changed successfully!' });
    } else {
      const user = await memoryStore.findUserById(req.user._id || req.user.id);
      if (!user) {
        return res.status(400).json({ success: false, message: 'User not found.' });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      return res.json({ success: true, message: 'Password changed successfully!' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
