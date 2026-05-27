const { google } = require('googleapis');

module.exports = async (req, res) => {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );
    const sheets = google.sheets({ version: 'v4', auth });
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Default Tees!A2:C', // A: Player, B: Course, C: Tee Option
    });
    
    const rows = response.data.values || [];
    const tees = rows.map(row => ({
      Player: row[0] || '',
      Course: row[1] || '',
      Tee: row[2] || ''
    }));
    
    return res.status(200).json(tees);
  } catch (error) {
    console.error("Tees Preference Engine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
