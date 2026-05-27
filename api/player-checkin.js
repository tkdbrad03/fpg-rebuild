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
    const { event, playerName, guestNames, usesDefaultTees, notes } = req.body;
    
    // Strict execution sanity validation checks
    if (!event || !playerName) {
      return res.status(400).json({ error: 'Missing non-negotiable core data fields.' });
    }

    // East Coast Local Timestamp generation footprint tracking
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // Precise Sheet Column Order Mapping Rule Check:
    // A: Timestamp, B: Event, C: Player Name, D: Guest Names, E: Quick Selection,
    // F: Individual Games, G: Total, H: Pairing Request, I: Cart Path, J: Default Tee, K: Notes
    const rowValues = [
      timestamp,        // Column A
      event,            // Column B
      playerName,       // Column C
      guestNames || '', // Column D
      '',               // Column E
      '',               // Column F
      '',               // Column G
      notes || '',      // Column H
      '',               // Column I
      usesDefaultTees,  // Column J ('Yes' or 'No')
      ''                // Column K
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'CheckIns2!A:K',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowValues]
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Write Operation Database Failure:", error);
    return res.status(500).json({ error: error.message });
  }
};
