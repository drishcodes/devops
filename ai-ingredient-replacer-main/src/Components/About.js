import React from 'react';
import '../styles/HeroSection.css';

const About = () => (
  <section className="hero-container">
    <div className="overlay">
      <div className="hero-text" style={{ maxWidth: 600, animation: 'fadeIn 1.2s ease-in-out' }}>
        <div className="title-wrapper">
          <h1 className="glass-title" style={{ marginBottom: '1rem' }}>
            {'About FoodFit AI'.split('').map((char, i) => (
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
        <p style={{ fontSize: '1.15rem', marginBottom: '1.5rem', color: '#fff' }}>
          <b>FoodFit AI</b> is your smart kitchen companion! We help you cook delicious meals tailored to your dietary needs, allergies, and preferences. Paste or upload recipes, and our AI will suggest healthy ingredient swaps, generate new recipes, and even help you shop smarter.
        </p>
        <ul style={{ textAlign: 'left', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.7 }}>
          <li>AI-powered ingredient replacer for allergies & diets</li>
          <li>Personalized recipe recommendations</li>
          <li>Community sharing & feedback</li>
          <li>Shopping list generator</li>
          <li>Fun mood-based meal suggestions</li>
        </ul>
        <p style={{ color: '#fff', fontWeight: 500 }}>
          Join us and make every meal fit your lifestyle!
        </p>
      </div>
    </div>
  </section>
);

export default About; 