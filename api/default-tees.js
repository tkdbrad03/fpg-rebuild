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
      range: 'Default Tees!A2:H', // A: Course, B: Men's Default, C: Men's Yardage, E: Men's Alt, G: Women's Default, H: Women's Yardage
    });
    
const tees = rows.map(row => ({
  Course: row[0] || '',
  MensDefault: row[1] || '',
  MensYardage: row[2] || '',
  MensAlt: row[4] || '',
  WomensDefault: row[6] || '',
  WomensYardage: row[7] || ''
}));
    
    return res.status(200).json(tees);
  } catch (error) {
    console.error("Tees Preference Engine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
