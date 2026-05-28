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

    const [membersRes, quotasRes] = await Promise.all([
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'FPG Members!A2:I'
      }),
      sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Player Quotas!A2:C'
      })
    ]);

    const quotaMap = {};
    (quotasRes.data.values || []).forEach(row => {
      if (row[0]) quotaMap[row[0].trim()] = parseInt(row[2]) || 0;
    });

    const rows = membersRes.data.values || [];
    const handicaps = rows
      .filter(row => row[0])
      .map(row => ({
        name: row[0] || '',
        handicap: row[1] ? parseFloat(row[1]) : null,
        photo: row[8] || '',
        quota: quotaMap[row[0].trim()] || 0
      }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(handicaps);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
