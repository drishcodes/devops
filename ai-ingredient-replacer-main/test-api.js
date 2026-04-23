const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Test configuration
const MONGODB_URI = 'mongodb+srv://user2:user2@cluster0.tza4mdu.mongodb.net/myDatabase?retryWrites=true&w=majority';
const JWT_SECRET = '98f58dd3b39dc11f7a6c0e1ce78f11ad7d6f680bfb6e2728a1a56698446c364f';

// Simple User model for testing
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  password: String
});
const User = mongoose.model('User', userSchema);

async function testAuth() {
  console.log('Testing authentication...');
  
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Test 1: Register a new user
    console.log('\n--- Test 1: Register ---');
    const testPassword = 'test123456';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    const newUser = new User({
      fullName: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: hashedPassword
    });
    
    await newUser.save();
    console.log('✅ User registered:', newUser.email);
    
    // Test 2: Generate JWT token
    console.log('\n--- Test 2: Generate JWT Token ---');
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });
    console.log('✅ Token generated:', token.substring(0, 20) + '...');
    
    // Test 3: Verify JWT token
    console.log('\n--- Test 3: Verify JWT Token ---');
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token verified, user ID:', decoded.id);
    
    // Test 4: Find user and verify password
    console.log('\n--- Test 4: Find User & Verify Password ---');
    const foundUser = await User.findOne({ email: newUser.email });
    if (!foundUser) {
      throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(testPassword, foundUser.password);
    console.log('✅ Password verified:', isMatch);
    
    // Cleanup
    await User.deleteOne({ email: newUser.email });
    console.log('\n✅ Test user cleaned up');
    
    console.log('\n✅ All authentication tests passed!');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

testAuth();
