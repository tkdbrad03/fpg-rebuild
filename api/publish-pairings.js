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

    const { date, course, groups } = req.body;

    if (!date || !course || !Array.isArray(groups) || groups.length === 0) {
      return res.status(400).json({ error: 'Missing required fields: date, course, groups' });
    }

    await sheets.spreadsheets.values.clear({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Pairings!A2:J1000'
    });

    const rows = [];
    groups.forEach(group => {
      const { groupNumber, teeTime, players, scorekeepers, gamingCoordinator } = group;
      (players || []).forEach(player => {
        const name = typeof player === 'string' ? player : player.name;
        const isSK = scorekeepers && scorekeepers.includes(name);
        const skNote = isSK ? `SK${scorekeepers.indexOf(name) + 1}` : '';
        const isGC = gamingCoordinator === name;
        rows.push([
          date, course, groupNumber, name, teeTime,
          skNote,
          player.handicap || 0,
          player.quota || 0,
          isGC ? 'GC' : '',
          player.strokes || 0
        ]);
      });
    });

    if (rows.length > 0) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Pairings!A2',
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: rows }
      });
    }

    return res.status(200).json({
      success: true,
      groupsPublished: groups.length,
      playersPublished: rows.length
    });

  } catch (error) {
    console.error('Publish pairings error:', error);
    return res.status(500).json({ error: error.message });
  }
};
