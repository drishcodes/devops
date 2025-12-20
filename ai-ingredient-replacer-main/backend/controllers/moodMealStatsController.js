const MoodMealStats = require('../models/MoodMealStats');
const MoodMeal = require('../models/MoodMeal');
const mongoose = require('mongoose');
const { logActivity } = require('./activityLogController');

// Track user mood selection
exports.trackMoodSelection = async (req, res) => {
  try {
    const { mood, mealId } = req.body;
    const userId = req.user.id;
    
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }
    
    // Create a new mood selection record
    const moodStat = new MoodMealStats({
      user: userId,
      mood,
      selectedMeal: mealId || null
    });
    
    await moodStat.save();
    
    // Log this activity
    await logActivity(userId, 'Mood Selected', `Selected ${mood} mood`);
    
    res.status(201).json({
      success: true,
      moodStat
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update meal interaction (like/save)
exports.updateMoodMealInteraction = async (req, res) => {
  try {
    const { statId, liked, saved } = req.body;
    const userId = req.user.id;
    
    if (!statId) {
      return res.status(400).json({ message: 'Stat ID is required' });
    }
    
    // Find the stat record and verify ownership
    const stat = await MoodMealStats.findById(statId);
    
    if (!stat) {
      return res.status(404).json({ message: 'Mood stat not found' });
    }
    
    if (stat.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this record' });
    }
    
    // Update the interaction
    if (liked !== undefined) stat.liked = liked;
    if (saved !== undefined) stat.saved = saved;
    
    await stat.save();
    
    // Log this activity
    const action = liked ? 'liked' : (saved ? 'saved' : 'updated');
    await logActivity(userId, 'Meal Interaction', `${action} a meal recommendation`);
    
    res.json({
      success: true,
      stat
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user's mood stats
exports.getUserMoodStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get mood selection counts
    const moodCounts = await MoodMealStats.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Get most liked and saved meals
    const likedMeals = await MoodMealStats.find({ user: userId, liked: true })
      .sort({ createdAt: -1 })
      .populate('selectedMeal')
      .limit(5);
    
    res.json({
      moodCounts,
      likedMeals
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get user's saved meals
exports.getUserSavedMeals = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const savedStats = await MoodMealStats.find({ user: userId, saved: true })
      .sort({ createdAt: -1 })
      .populate('selectedMeal');
    
    // Extract just the meals
    const savedMeals = savedStats
      .filter(stat => stat.selectedMeal) // Filter out null meals
      .map(stat => stat.selectedMeal);
    
    res.json(savedMeals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get mood analytics for dashboard
exports.getMoodAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get top mood
    const topMood = await MoodMealStats.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    
    // Get most saved meal
    const topSavedMeal = await MoodMealStats.find({ user: userId, saved: true })
      .sort({ createdAt: -1 })
      .populate('selectedMeal')
      .limit(1);
    
    // Get total selections
    const totalSelections = await MoodMealStats.countDocuments({ user: userId });
    
    // Get mood trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const moodTrend = await MoodMealStats.aggregate([
      { 
        $match: { 
          user: mongoose.Types.ObjectId(userId),
          createdAt: { $gte: sevenDaysAgo }
        } 
      },
      {
        $group: {
          _id: {
            mood: '$mood',
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);
    
    res.json({
      topMood: topMood.length > 0 ? topMood[0] : null,
      topSavedMeal: topSavedMeal.length > 0 ? topSavedMeal[0].selectedMeal : null,
      totalSelections,
      moodTrend
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};