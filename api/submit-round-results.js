const { google } = require('googleapis');

const RESULTS_SHEET = 'Round Results';

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
      courseName,
      roundDate,
      roundId,
      finalizedBy,
      group,
      results,
      payouts,
      notes
    } = req.body;

    if (!roundDate || !results || !Array.isArray(results)) {
      return res.status(400).json({ error: 'Missing required fields: roundDate, results' });
    }

    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });

    // Ensure sheet exists
    try {
      const meta = await sheets.spreadsheets.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID
      });
      const exists = (meta.data.sheets || []).find(s => s.properties?.title === RESULTS_SHEET);
      if (!exists) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          requestBody: {
            requests: [{ addSheet: { properties: { title: RESULTS_SHEET } } }]
          }
        });
        // Add headers
        await sheets.spreadsheets.values.update({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: `${RESULTS_SHEET}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
              'Timestamp', 'Round Date', 'Course', 'Group', 'Round ID',
              'Player Name', 'Stableford Total', 'Quota', 'Quota Diff',
              'Winnings Total', 'Finalized By', 'Notes'
            ]]
          }
        });
      }
    } catch (e) {
      console.error('Sheet check error:', e);
    }

    // Build rows — one per player result
    const rows = results.map(r => [
      timestamp,
      roundDate,
      courseName || '',
      group || '',
      roundId || '',
      r.playerName || '',
      r.stablefordTotal || 0,
      r.quota || 0,
      r.quotaDiff || 0,
      r.winningsTotal || 0,
      finalizedBy || '',
      notes || ''
    ]);

    if (rows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${RESULTS_SHEET}!A:L`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: rows }
      });
    }

    return res.status(200).json({
      success: true,
      rowsWritten: rows.length,
      roundId
    });

  } catch (error) {
    console.error('Submit round results error:', error);
    return res.status(500).json({ error: error.message });
  }
};
