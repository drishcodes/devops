const CommunityPost = require('../models/CommunityPost');

// Get all posts, sort by newest
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .populate('author', 'name email') // assuming user has name/email fields
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    res.status(500).json({ message: 'Server error fetching posts' });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // In our setup, req.user should be populated by authMiddleware
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const newPost = new CommunityPost({
      title,
      content,
      author: req.user.id
    });

    const savedPost = await newPost.save();
    // Populate author before returning so frontend has it immediately
    await savedPost.populate('author', 'name email');
    
    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Error creating community post:', error);
    res.status(500).json({ message: 'Server error creating post' });
  }
};

// Toggle like on a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user already liked it
    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      post.likes.push(userId);
    }

    await post.save();
    await post.populate('author', 'name email');
    
    res.json(post);
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error liking post' });
  }
};

// Delete a post (optional, good to have)
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await CommunityPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure only author can delete
    if (post.author.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Server error deleting post' });
  }
};
