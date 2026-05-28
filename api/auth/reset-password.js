const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

const SPREADSHEET_ID = '152dK2m3gluxCdBal9GGLs43aDKFBvy5BiHdnKL3gV4o';
const CREDENTIALS_SHEET = 'Credentials';

const JWT_SECRET = process.env.JWT_SECRET || 'FPG2025SecureKey!ChangeThisInProduction';

async function getAuthClient() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  return await auth.getClient();
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Reset link has expired. Please request a new one.' });
      }
      return res.status(400).json({ error: 'Invalid reset link. Please request a new one.' });
    }

    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    const { username, rowIndex } = decoded;

    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    let currentData;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${CREDENTIALS_SHEET}!A${rowIndex}:E${rowIndex}`
      });
      currentData = response.data.values?.[0];
    } catch (error) {
      console.error('Error reading credentials:', error);
      return res.status(500).json({ error: 'System error. Please contact administrator.' });
    }

    if (!currentData || currentData[0] !== username) {
      console.error(`Username mismatch: expected ${username}, found ${currentData?.[0]}`);
      return res.status(400).json({ error: 'Invalid reset request. Please request a new reset link.' });
    }

    try {
      // Update password in column B and Last Changed in column E
      const now = new Date().toISOString();
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${CREDENTIALS_SHEET}!B${rowIndex}:E${rowIndex}`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[newPassword, currentData[2] || 'Leadership', currentData[3] || '', now]]
        }
      });
      
      console.log(`Password updated for user: ${username}`);
    } catch (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(500).json({ error: 'Failed to update password. Please try again.' });
    }

    return res.json({ 
      success: true, 
      message: 'Password has been reset successfully. You can now log in with your new password.' 
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
};
