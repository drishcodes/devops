import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllCommunityPosts, createCommunityPost, likeCommunityPost } from '../api';
import '../styles/Community.css';
import Loader from './Loader';

const Community = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllCommunityPosts();
      setPosts(data);
    } catch (err) {
      setError('Failed to load community posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setIsSubmitting(true);
      const newPost = await createCommunityPost({ title, content });
      setPosts([newPost, ...posts]);
      setTitle('');
      setContent('');
    } catch (err) {
      setError('Failed to create post');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const updatedPost = await likeCommunityPost(postId);
      setPosts(posts.map(post => post._id === postId ? updatedPost : post));
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <Loader />;

  return (
    <div className="community-page-container">
      <div className="community-header">
        <h2>Community Feed</h2>
        <p>Share your favorite recipes, tips, and connect with food lovers!</p>
      </div>

      <div className="community-content-wrapper">
        <div className="create-post-section">
          <h3>Create a Post</h3>
          {error && <div className="error-message">{error}</div>}
          <form className="create-post-form" onSubmit={handleCreatePost}>
            <input
              type="text"
              placeholder="Give your post a catchy title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Share your recipe, food thoughts, or diet tips here!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              required
            ></textarea>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Share with Community'}
            </button>
          </form>
        </div>

        <div className="community-feed">
          {posts.length === 0 ? (
             <div className="empty-state">
               <h3>No posts yet.</h3>
               <p>Be the first to share something delicious!</p>
             </div>
          ) : (
            posts.map(post => {
              const hasLiked = post.likes && user && post.likes.includes(user.id);
              
              return (
                <div key={post._id} className="post-card fade-in">
                  <div className="post-header">
                    <div className="author-info">
                      <div className="author-avatar">
                        {post.author?.name ? post.author.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <h4>{post.author?.name || 'Unknown Author'}</h4>
                        <span className="post-date">{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="post-body">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-text">{post.content}</p>
                  </div>
                  
                  <div className="post-footer">
                    <button 
                      className={`like-button ${hasLiked ? 'liked' : ''}`}
                      onClick={() => handleLike(post._id)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                      <span>{post.likes ? post.likes.length : 0} Likes</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
