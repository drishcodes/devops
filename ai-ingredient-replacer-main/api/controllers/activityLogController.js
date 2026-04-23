const ActivityLog = require('../models/ActivityLog');
const User = require('../models/User');

// Create a new activity log
exports.createActivityLog = async (req, res) => {
  try {
    const { type, details } = req.body;
    
    if (!type) {
      return res.status(400).json({ message: 'Activity type is required' });
    }
    
    const newActivity = new ActivityLog({
      user: req.user._id,
      type,
      details,
    });
    
    await newActivity.save();
    
    res.status(201).json({
      success: true,
      activity: newActivity
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get recent activity logs
exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'fullName email');
    
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Helper function to log activity (can be called from other controllers)
exports.logActivity = async (userId, type, details) => {
  try {
    const newActivity = new ActivityLog({
      user: userId,
      type,
      details,
    });
    
    await newActivity.save();
    return newActivity;
  } catch (err) {
    console.error('Error logging activity:', err);
    return null;
  }
};