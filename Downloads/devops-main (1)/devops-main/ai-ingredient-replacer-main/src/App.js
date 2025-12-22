import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Loader from './Components/Loader';
import ProtectedRoute from './Components/ProtectedRoute';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Lazy load components
const HeroSection = lazy(() => import('./Components/HeroSection'));
const Replacer = lazy(() => import('./Components/Replacer'));
const Chatbot = lazy(() => import('./Components/Chatbot'));
const Recipes = lazy(() => import('./Components/Recipes'));
const Community = lazy(() => import('./Components/Community'));
const Register = lazy(() => import('./Components/Register'));
const Login = lazy(() => import('./Components/Login'));
const SavedRecipes = lazy(() => import('./Components/SavedRecipes'));
const Shopping = lazy(() => import('./Components/Shopping'));
const MoodSelector = lazy(() => import('./Components/MoodSelector'));
const Dashboard = lazy(() => import('./Components/Dashboard'));
const About = lazy(() => import('./Components/About'));
const Contact = lazy(() => import('./Components/Contact'));


function AppRoutes() {
  const { isLoggedIn, loading } = useContext(AuthContext);
  
  // Show loader while checking authentication status
  if (loading) {
    return <Loader />;
  }
  
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HeroSection />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Register />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/about" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <About />} />
        <Route path="/contact" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Contact />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/replacer" element={
          <ProtectedRoute>
            <Replacer />
          </ProtectedRoute>
        } />
        <Route path="/chatbot" element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        } />
        <Route path="/recipes" element={
          <ProtectedRoute>
            <Recipes />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        } />
        <Route path="/saved-recipes" element={
          <ProtectedRoute>
            <SavedRecipes />
          </ProtectedRoute>
        } />
        <Route path="/shopping" element={
          <ProtectedRoute>
            <Shopping />
          </ProtectedRoute>
        } />
        <Route path="/moodmeals" element={
          <ProtectedRoute>
            <MoodSelector />
          </ProtectedRoute>
        } />
        
        {/* Fallback route - redirect to dashboard if logged in, otherwise to home */}
        <Route path="*" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
