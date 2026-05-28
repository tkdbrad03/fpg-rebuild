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
      range: 'CheckIns2!A2:K'
    });

    const rows = response.data.values || [];
    const checkins = rows.map((row, index) => ({
      rowIndex: index + 2,
      timestamp: row[0] || '',
      event: row[1] || '',
      playerName: row[2] || '',
      guestNames: row[3] || '',
      quickSelection: row[4] || '',
      individualGames: row[5] || '',
      totalPayment: row[6] || '',
      pairingRequest: row[7] || '',
      cartPathOnly: row[8] || '',
      defaultTee: row[9] || '',
      notes: row[10] || ''
    })).filter(r => r.playerName);

    const { event } = req.query;
    const filtered = event
      ? checkins.filter(r => r.event === decodeURIComponent(event))
      : checkins;

    return res.status(200).json(filtered);
  } catch (error) {
    console.error('Admin checkins error:', error);
    return res.status(500).json({ error: error.message });
  }
};
