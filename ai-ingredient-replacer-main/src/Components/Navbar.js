import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import VoiceSearch from './VoiceSearch';
import { AuthContext } from '../context/AuthContext';
import Modal from './Modal';

/**
 * Navbar
 * Displays the top navigation bar with logo, navigation links, and auth buttons.
 * Uses React Router's <Link> for client-side navigation.
 * Shows different options based on authentication status.
 */
const Navbar = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Handler for login-required features
  const handleLoginPrompt = () => setModalOpen(true);

  return (
    <nav className="navbar">
      
      {/* Logo and App Name (Left Section) */}
      <div className="navbar-left">
        <img
          src={`${process.env.PUBLIC_URL}/FoodFitAIlogo.png`}
          alt="Logo"
          className="logo"
        />
        <span className="app-name">FoodFit AI</span>
      </div>

      {/* Navigation Links (Center Section) */}
      <ul className="navbar-center">
        {!isLoggedIn ? (
          // Show Home, About, and Contact for non-logged-in users
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </>
        ) : (
          // Show all features except Home for logged-in users
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/replacer">Replacer</Link></li>
            <li><Link to="/chatbot">Chatbot</Link></li>
            <li><Link to="/recipes">Recipes</Link></li>
            <li><Link to="/community">Community</Link></li>
            <li><Link to="/shopping">Shopping</Link></li>
            <li><Link to="/moodmeals">MoodMeals</Link></li>
          </>
        )}
      </ul>

      {/* Authentication Buttons (Right Section) */}
      <div className="navbar-right">
        {/* VoiceSearch: disabled or prompts login if not logged in */}
        <VoiceSearch isLoggedIn={isLoggedIn} onLoginPrompt={handleLoginPrompt} />
        {!isLoggedIn ? (
          // Show Login and Register for non-logged-in users
          <>
            <Link to="/login" className="no-underline">
              <button className="nav-btn login">Login</button>
            </Link>
            <Link to="/register" className="no-underline">
              <button className="nav-btn register" style={{ border: '2px solid #00c896', color: '#00c896', background: '#fff', fontWeight: 700 }}>Register</button>
            </Link>
          </>
        ) : (
          // Show Logout for logged-in users
          <button className="nav-btn logout" onClick={handleLogout}>
            Logout
          </button>
        )}
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
    </nav>
  );
};

export default Navbar;
