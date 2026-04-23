const express = require('express');
const router = express.Router();
const { getAllPosts, createPost, likePost, deletePost } = require('../controllers/communityController');
const authMiddleware = require('../middleware/auth');

// Get all posts (public, or protected depending on preference. Making protected to match app)
router.get('/', authMiddleware, getAllPosts);

// Create a new post
router.post('/', authMiddleware, createPost);

// Like / Unlike a post
router.put('/:id/like', authMiddleware, likePost);

// Delete a post
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;
