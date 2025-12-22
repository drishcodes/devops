const mongoose = require('mongoose');
const moodMealSchema = new mongoose.Schema({
  mood: { type: String, required: true },
  title: String,
  description: String,
  recipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('MoodMeal', moodMealSchema); 