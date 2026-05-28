const { google } = require('googleapis');

const SHEET_NAME = 'GameCoordinator_CTP';

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  return new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

async function ensureSheetExists(sheets) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID });
  const existing = (meta.data.sheets || []).find(s => s.properties?.title === SHEET_NAME);
  if (!existing) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: SHEET_NAME } } }] }
    });
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: [['Timestamp', 'RoundDate', 'CourseName', 'SavedBy', 'Hole', 'Winner']] }
    });
  }
}

/**
 * POST /api/submit-ctp
 * Body: { roundDate, courseName, hole, winner, scorekeeperName }
 * 
 * Saves a CTP winner from a scorekeeper device to Google Sheets.
 * Called in real-time when a scorekeeper selects a CTP winner.
 * The coordinator reads from the same sheet, so data is shared across devices.
 */
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') {
    const { roundDate, courseName } = req.query || {};
    if (!roundDate || !courseName) return res.status(400).json({ error: 'Missing roundDate or courseName' });
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    await ensureSheetExists(sheets);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${SHEET_NAME}!A2:F10000`
    });
    const rows = response.data.values || [];
    const data = rows
      .filter(row => row[1] === roundDate && row[2] === courseName && row[5])
      .map(row => ({ hole: Number(row[4]), winner: row[5] }));
    return res.status(200).json({ success: true, data });
  }

if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { roundDate, courseName, hole, winner, scorekeeperName = 'Scorekeeper' } = req.body || {};

    if (!roundDate || !courseName || !hole) {
      return res.status(400).json({ error: 'Missing required fields: roundDate, courseName, hole' });
    }

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    await ensureSheetExists(sheets);

    // First, remove any existing entry for this hole/round/course (upsert behavior)
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${SHEET_NAME}!A2:F10000`
      });
      const rows = response.data.values || [];
      const updates = [];
      rows.forEach((row, index) => {
        if (row[1] === roundDate && row[2] === courseName && Number(row[4]) === Number(hole)) {
          updates.push({
            range: `${SHEET_NAME}!A${index + 2}:F${index + 2}`,
            values: [[]]
          });
        }
      });
      if (updates.length > 0) {
        await sheets.spreadsheets.values.batchUpdate({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          requestBody: { data: updates, valueInputOption: 'RAW' }
        });
      }
    } catch (e) {
      // Sheet might be empty, that's fine
    }

    // If winner is empty string, we're just clearing the entry (already done above)
    if (winner) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${SHEET_NAME}!A:F`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: [[
            new Date().toISOString(),
            roundDate,
            courseName,
            scorekeeperName,
            Number(hole),
            winner
          ]]
        }
      });
    }

    return res.status(200).json({ success: true, hole, winner: winner || null });

  } catch (error) {
    console.error('Error saving CTP winner:', error);
    return res.status(500).json({ error: 'Failed to save CTP winner', details: error.message });
  }
};
