const { google } = require('googleapis');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );
    const sheets = google.sheets({ version: 'v4', auth });

    const {
      event,
      playerName,
      guestNames,
      quickSelection,
      individualGames,
      totalPayment,
      pairingRequest,
      cartPathOnly,
      defaultTee,
      notes
    } = req.body;

    if (!event || !playerName) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // Sheet column order:
    // A: Timestamp | B: Event | C: Player Name | D: Guest Names
    // E: Quick Selection | F: Individual Games | G: Expected Total Payment
    // H: Pairing Requests | I: Cart Path Only | J: Default Tee | K: Notes
    const rowValues = [
      timestamp,                  // A
      event,                      // B
      playerName,                 // C
      guestNames || '',           // D
      quickSelection || '',       // E
      individualGames || '',      // F
      totalPayment != null ? `$${totalPayment}` : '', // G
      pairingRequest || '',       // H
      cartPathOnly || '',         // I
      defaultTee || '',           // J
      notes || ''                 // K
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'CheckIns2!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [rowValues] }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Checkin write error:", error);
    return res.status(500).json({ error: error.message });
  }
};
