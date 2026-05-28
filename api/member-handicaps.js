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
      range: 'FPG Members!A2:I', // A: Name, B: GHIN HCP
    });

    const rows = response.data.values || [];
    const handicaps = rows
      .filter(row => row[0])
      .map(row => ({
  name: row[0] || '',
  handicap: row[1] ? parseFloat(row[1]) : null,
  photo: row[8] || ''
}));

    return res.status(200).json(handicaps);
  } catch (error) {
    console.error('Member handicaps error:', error);
    return res.status(500).json({ error: error.message });
  }
};
