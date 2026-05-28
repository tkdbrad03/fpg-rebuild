const { google } = require('googleapis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { playerName, handicap } = req.body;
    if (!playerName || handicap === undefined) {
      return res.status(400).json({ error: 'playerName and handicap are required' });
    }

    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    const sheets = google.sheets({ version: 'v4', auth });

    // Find the player's row in FPG Members column A
    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'FPG Members!A2:A'
    });

    const rows = resp.data.values || [];
    let targetRow = null;

    for (let i = 0; i < rows.length; i++) {
      if ((rows[i][0] || '').trim().toLowerCase() === playerName.trim().toLowerCase()) {
        targetRow = i + 2;
        break;
      }
    }

    if (!targetRow) {
      return res.status(404).json({ error: `Player not found: ${playerName}` });
    }

    // Write handicap to column B of that row
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `FPG Members!B${targetRow}`,
      valueInputOption: 'RAW',
      requestBody: { values: [[parseFloat(handicap)]] }
    });

    return res.status(200).json({ success: true, playerName, handicap: parseFloat(handicap) });

  } catch (error) {
    console.error('Error updating GHIN HCP:', error);
    return res.status(500).json({ error: error.message });
  }
};
