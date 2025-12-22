import React, { useContext, useState } from 'react';
import '../styles/HeroSection.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Modal from './Modal';

/**
 * HeroSection
 * This is the main landing/hero section of the app.
 * It includes animated branding text, a search bar, and navigation buttons.
 */
const HeroSection = () => {
  const [query, setQuery] = useState('');      // Stores ingredient search input
  const [hovered, setHovered] = useState(false); // For hover effect on title
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();              // Navigation hook from React Router
  const { isLoggedIn } = useContext(AuthContext);

  // Handler for login-required features
  const handleLoginPrompt = () => setModalOpen(true);

  /**
   * Handles the ingredient search button click
   * Redirects to /search page with the ingredient query
   */
  const handleSearch = () => {
    if (!isLoggedIn) {
      handleLoginPrompt();
      return;
    }
    if (query.trim() !== '') {
      navigate(`/search?ingredient=${encodeURIComponent(query)}`);
    }
  };

  const handleReplacer = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      handleLoginPrompt();
    }
  };

  const handleRecipeBot = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      handleLoginPrompt();
    }
  };

  const handleSavedRecipes = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      handleLoginPrompt();
    }
  };

  return (
    <section className="hero-container">
      <div className="overlay">
        <div className="glass-box">
          <div className="hero-text">

            {/* Animated rainbow-colored title */}
            <div className={`title-wrapper ${hovered ? 'enlarged' : ''}`}>
              <h1 className="glass-title">
                {'Cook Freely with AI'.split('').map((char, i) => (
                  <span
                    key={i}
                    className="rainbow-letter"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h1>
            </div>

            {/* Auto-scrolling subheading text */}
            <div className="auto-scroll-text">
              <span>
                Paste or upload a recipe, select your dietary needs or allergies, and get a tailored recipe with smart substitutions.
              </span>
            </div>

            {/* Ingredient search bar */}
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search ingredients (e.g., milk)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="search-btn"
                onClick={handleSearch}
                disabled={!isLoggedIn}
                title={isLoggedIn ? 'Search' : 'Login to view results'}
                style={{ opacity: isLoggedIn ? 1 : 0.6, cursor: isLoggedIn ? 'pointer' : 'not-allowed' }}
              >
                Search
              </button>
            </div>

            {/* Navigation buttons: Replacer, RecipeBot, Register */}
            <div
              className="hero-buttons"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Link to="/replacer" className="no-underline" onClick={handleReplacer}>
                <button className="btn green">Try Replacer</button>
              </Link>
              <Link to="/chatbot" className="no-underline" onClick={handleRecipeBot}>
                <button className="btn blue">Ask RecipeBot</button>
              </Link>
              <Link to="/register" className="no-underline">
                <button className="btn yellow">Join Now</button>
              </Link>
              {/* Saved Recipes: hide or disable for non-logged-in users */}
              {isLoggedIn ? (
                <Link to="/saved-recipes" className="no-underline">
                  <button className="btn red">Saved Recipes</button>
                </Link>
              ) : (
                <button
                  className="btn red"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                  onClick={handleSavedRecipes}
                  title="Login to access saved recipes"
                >
                  Saved Recipes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal for login-required features */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h2 style={{ color: '#00c896', marginBottom: 16 }}>Login Required</h2>
        <p style={{ marginBottom: 24 }}>
          This feature is available for registered users. Please log in or sign up to continue.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn green" onClick={() => { setModalOpen(false); navigate('/login'); }}>Login</button>
          <button className="btn yellow" onClick={() => { setModalOpen(false); navigate('/register'); }}>Sign Up</button>
        </div>
      </Modal>
    </section>
  );
};

export default HeroSection;

