import React, { useState, useContext } from 'react';
import '../styles/HeroSection.css';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({ email, password });
      login(data.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="hero-container">
      <div className="overlay">
        <div className="hero-text" style={{ maxWidth: 400, animation: 'fadeIn 1.2s ease-in-out' }}>
          <div className="title-wrapper">
            <h1 className="glass-title" style={{ marginBottom: '1rem' }}>
              {'Login'.split('').map((char, i) => (
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
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '12px', borderRadius: '8px', border: 'none', fontSize: '1rem' }}
            />
            <button className="btn blue" type="submit">Login</button>
            <p className="switch-link" style={{ color: '#fff' }}>
              Don't have an account? <a href="/register" style={{ color: '#00e6a2' }}>Register</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
