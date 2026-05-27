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
      range: 'CheckIns2!B2:C', // B: Event String, C: Player Name
    });
    
    const rows = response.data.values || [];
    const checkins = rows.map(row => ({
      Event: row[0] || '',
      PlayerName: row[1] || ''
    }));
    
    return res.status(200).json(checkins);
  } catch (error) {
    console.error("Checkins Context Engine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
