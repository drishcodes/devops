const Suggestion = require('../models/Suggestion');
const { logActivity } = require('./activityLogController');

// Create a new suggestion
exports.createSuggestion = async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({ message: 'Suggestion text is required' });
    }
    
    const newSuggestion = new Suggestion({
      user: req.user._id,
      text,
    });
    
    await newSuggestion.save();
    
    // Log this activity
    await logActivity(req.user._id, 'Suggestion Created', `Created a new suggestion: ${text.substring(0, 30)}...`);
    
    res.status(201).json({
      success: true,
      suggestion: newSuggestion
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all suggestions
exports.getAllSuggestions = async (req, res) => {
  try {
    const suggestions = await Suggestion.find()
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email');
    
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get suggestion of the day (most recent one)
exports.getSuggestionOfTheDay = async (req, res) => { // request and response
  try {
    const suggestion = await Suggestion.findOne()
      .sort({ createdAt: -1 })
      .populate('user', 'fullName email');
    
    if (!suggestion) {
      return res.json({ text: 'No suggestions available yet.' });
    }
    
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create a default suggestion if none exists (for seeding purposes)
exports.createDefaultSuggestion = async () => {
  try {
    const count = await Suggestion.countDocuments();
    
    if (count === 0) {
      const defaultSuggestion = new Suggestion({
        text: 'Try replacing butter with avocado in your next baking recipe for a healthier fat option!',
      });
      
      await defaultSuggestion.save();
      console.log('Default suggestion created');
    }
  } catch (err) {
    console.error('Error creating default suggestion:', err);
  }
};