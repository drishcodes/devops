const express = require('express');
const router = express.Router();
const { getAllRecipes, getRecipeCount, addRecipe, deleteRecipe, updateRecipe } = require('../controllers/recipeController');
const auth = require('../middleware/auth');

router.get('/', getAllRecipes);
router.get('/count', getRecipeCount);
router.post('/', auth, addRecipe);
router.delete('/:id', auth, deleteRecipe);
router.put('/:id', auth, updateRecipe);

module.exports = router;