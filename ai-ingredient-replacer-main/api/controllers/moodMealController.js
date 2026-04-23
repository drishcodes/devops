const MoodMeal = require('../models/MoodMeal');
const Recipe = require('../models/Recipe');
const { logActivity } = require('./activityLogController');

// Create a new mood meal
exports.createMoodMeal = async (req, res) => {
  try {
    const { mood, title, description, recipeIds } = req.body;
    
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }
    
    // Verify all recipe IDs exist
    if (recipeIds && recipeIds.length > 0) {
      const recipes = await Recipe.find({ _id: { $in: recipeIds } });
      if (recipes.length !== recipeIds.length) {
        return res.status(400).json({ message: 'One or more recipe IDs are invalid' });
      }
    }
    
    const newMoodMeal = new MoodMeal({
      mood,
      title: title || `${mood} Meal`,
      description: description || `A meal suggestion for when you're feeling ${mood.toLowerCase()}`,
      recipes: recipeIds || [],
    });
    
    await newMoodMeal.save();
    
    // Log this activity
    if (req.user) {
      await logActivity(req.user.id, 'Mood Meal Created', `Created a new ${mood} meal suggestion`);
    }
    
    res.status(201).json({
      success: true,
      moodMeal: newMoodMeal
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all mood meals
exports.getAllMoodMeals = async (req, res) => {
  try {
    const moodMeals = await MoodMeal.find()
      .sort({ createdAt: -1 })
      .populate('recipes');
    
    res.json(moodMeals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get mood meals by mood
exports.getMoodMealsByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    
    const moodMeals = await MoodMeal.find({ mood: { $regex: new RegExp(mood, 'i') } })
      .sort({ createdAt: -1 })
      .populate('recipes');
    
    res.json(moodMeals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Create default mood meals if none exist (for seeding purposes)
exports.createDefaultMoodMeals = async () => {
  try {
    const count = await MoodMeal.countDocuments();
    
    if (count === 0) {
      const defaultMoodMeals = [
        {
          mood: 'Happy',
          title: 'Celebration Meal',
          description: 'A bright and colorful meal to celebrate your good mood!',
        },
        {
          mood: 'Tired',
          title: 'Energy Boost',
          description: 'Quick and nutritious recipes to help you regain energy.',
        },
        {
          mood: 'Stressed',
          title: 'Comfort Food',
          description: 'Soothing recipes to help you relax and unwind.',
        }
      ];
      
      await MoodMeal.insertMany(defaultMoodMeals);
      console.log('Default mood meals created');
    }
  } catch (err) {
    console.error('Error creating default mood meals:', err);
  }
};