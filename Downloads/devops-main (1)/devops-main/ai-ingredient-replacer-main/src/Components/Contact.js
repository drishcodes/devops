import React from 'react';
import '../styles/HeroSection.css';

const Contact = () => (
  <section className="hero-container">
    <div className="overlay">
      <div className="hero-text" style={{ maxWidth: 500, animation: 'fadeIn 1.2s ease-in-out' }}>
        <div className="title-wrapper">
          <h1 className="glass-title" style={{ marginBottom: '1rem' }}>
            {'Contact Us'.split('').map((char, i) => (
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
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: '#fff' }}>
          Have questions, feedback, or need support? We'd love to hear from you!
        </p>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          <input type="text" placeholder="Your Name" style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }} />
          <input type="email" placeholder="Your Email" style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }} />
          <textarea placeholder="Your Message" rows={4} style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem', resize: 'vertical' }} />
          <button className="btn blue" type="submit" disabled>Send Message</button>
        </form>
        <div style={{ color: '#fff', fontSize: '1rem', opacity: 0.85 }}>
          <div><b>Email:</b> support@foodfitai.com</div>
          <div><b>Twitter:</b> @FoodFitAI</div>
        </div>
      </div>
    </div>
  </section>
);

export default Contact; 