import React, { useState, useContext } from 'react';
import '../styles/HeroSection.css';
import { registerUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('All fields are required');
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      setError('Email must end with @gmail.com');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain at least one uppercase letter and one symbol');
      return;
    }

    try {
      const response = await registerUser({ fullName, email, password });
      login(response.token); // <-- Log the user in after registration
      alert('Registration successful');
      setFullName('');
      setEmail('');
      setPassword('');
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err.message);
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <section className="hero-container">
      <div className="overlay">
        <div className="hero-text" style={{ maxWidth: 400, animation: 'fadeIn 1.2s ease-in-out' }}>
          <div className="title-wrapper">
            <h1 className="glass-title" style={{ marginBottom: '1rem' }}>
              {'Register'.split('').map((char, i) => (
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
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
            />
            <input
              type="email"
              placeholder="Email (@gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
            />
            {error && <p className="error-message" style={{ color: '#ffb3b3', margin: 0 }}>{error}</p>}
            <button className="btn green" type="submit">Register</button>
            <p className="switch-link" style={{ color: '#fff' }}>
              Already have an account? <a href="/login" style={{ color: '#00e6a2' }}>Login</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Register;
