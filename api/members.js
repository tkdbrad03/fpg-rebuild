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
      range: 'FPG Members!A2:A', // Column A contains Member Names
    });
    
    const rows = response.data.values || [];
    const members = rows.map(row => row[0]).filter(Boolean); // Filters out any blank spaces
    
    return res.status(200).json(members);
  } catch (error) {
    console.error("Members Sheet Engine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
