const mongoose = require('mongoose');

const communityPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // The actual recipe or thoughts
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User IDs who liked it
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CommunityPost', communityPostSchema);
