const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

// Google Sheets configuration
const SPREADSHEET_ID = '152dK2m3gluxCdBal9GGLs43aDKFBvy5BiHdnKL3gV4o';
const CREDENTIALS_SHEET = 'Credentials';

// JWT Secret - Set this as an environment variable in Vercel
const JWT_SECRET = process.env.JWT_SECRET || 'FPG2025SecureKey!ChangeThisInProduction';
const TOKEN_EXPIRY = '24h';

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
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const authClient = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    let credentialsData;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${CREDENTIALS_SHEET}!A2:E`
      });
      credentialsData = response.data.values || [];
    } catch (error) {
      return res.status(500).json({ error: 'Credentials sheet not found. Please contact administrator.' });
    }

    // Credentials columns: A=Username, B=Password, C=Role, D=Email
    for (let i = 0; i < credentialsData.length; i++) {
      const row = credentialsData[i];
      const storedUsername = row[0] || '';
      const storedPassword = row[1] || '';
      const userRole = row[2] || 'Member';
      const userEmail = row[3] || '';

      if (username === storedUsername && password === storedPassword) {
        // Look up full name from FPG Members sheet BY EMAIL (not username)
        let fullName = username; // Default to username if lookup fails
        try {
          const membersResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'FPG Members!A:C' // A=Name, B=GHIN, C=Email
          });
          const memberRows = membersResponse.data.values || [];
          
          // CRITICAL FIX: Match by EMAIL (column C) not by name
          // This prevents "ray" from matching "McCray"
          const matchedRow = memberRows.find(row => {
            const memberEmail = (row[2] || '').toLowerCase().trim();
            const credentialEmail = userEmail.toLowerCase().trim();
            return memberEmail === credentialEmail;
          });
          
          if (matchedRow && matchedRow[0]) {
            fullName = matchedRow[0]; // Column A has the full name
          }
        } catch (memberLookupError) {
          console.error('Member name lookup failed:', memberLookupError);
          // Continue with username if lookup fails
        }
        
        const token = jwt.sign(
          {
            username: username,
            role: userRole,
            email: userEmail,
            loginTime: new Date().toISOString()
          },
          JWT_SECRET,
          { expiresIn: TOKEN_EXPIRY }
        );

        return res.json({
          token: token,
          user: { 
            username: username,
            name: fullName, // Now uses full name from FPG Members
            role: userRole,
            email: userEmail
          }
        });
      }
    }

    return res.status(401).json({ error: 'Invalid credentials' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
};
