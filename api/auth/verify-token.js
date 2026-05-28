const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'FPG2025SecureKey!ChangeThisInProduction';

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    const token = req.body.token || (authHeader && authHeader.replace('Bearer ', ''));

    if (!token) {
      return res.status(401).json({ 
        valid: false, 
        error: 'No token provided' 
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, JWT_SECRET);

    // CRITICAL: Check if email exists in the token
    // Old tokens from before the fix won't have email
    if (!decoded.email || decoded.email.trim() === '') {
      console.log('[verify-token] Old session detected - missing email. Rejecting token.');
      return res.status(401).json({ 
        valid: false, 
        error: 'Session expired. Please log in again.',
        reason: 'missing_email'
      });
    }

    // Token is valid and has email
    return res.status(200).json({
      valid: true,
      user: {
        username: decoded.username,
        name: decoded.name,
        email: decoded.email,  // Email is required
        role: decoded.role
      }
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        valid: false, 
        error: 'Token expired. Please log in again.' 
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        valid: false, 
        error: 'Invalid token. Please log in again.' 
      });
    }

    console.error('Token verification error:', error);
    return res.status(500).json({ 
      valid: false, 
      error: 'Server error during token verification' 
    });
  }
};
