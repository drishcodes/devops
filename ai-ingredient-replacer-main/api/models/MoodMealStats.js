const mongoose = require('mongoose');

const moodMealStatsSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },

  mood: { 
    type: String, 
    required: true 
  },

  selectedMeal: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'MoodMeal' 
  },

  liked: { 
    type: Boolean, 
    default: false 
  },

  saved: { 
    type: Boolean, 
    default: false 
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
  
});

// Create indexes for efficient querying
moodMealStatsSchema.index({ user: 1, createdAt: -1 }); // For user's history
moodMealStatsSchema.index({ mood: 1 }); // For mood-based queries
moodMealStatsSchema.index({ user: 1, saved: 1 }); // For saved meals

module.exports = mongoose.model('MoodMealStats', moodMealStatsSchema);