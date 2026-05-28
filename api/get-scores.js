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

    // A: Timestamp, B: Course Name, C: Date, D: Group
    // E: Player Name, F: Hole, G: Score, H: Stableford Points
    // I: Scorekeeper, J: Verified
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Live Scores!A2:J'
    });

    const rows = response.data.values || [];

    // Filter by course and date if provided
    const { course, date } = req.query;

    const scores = rows
      .filter(row => row[4]) // must have player name
      .filter(row => {
        if (course && date) {
          return row[1] === decodeURIComponent(course) &&
                 row[2] === decodeURIComponent(date);
        }
        return true;
      })
      .map(row => ({
        timestamp: row[0] || '',
        courseName: row[1] || '',
        date: row[2] || '',
        group: row[3] || '',
        playerName: row[4] || '',
        hole: parseInt(row[5]) || 0,
        score: parseInt(row[6]) || 0,
        stablefordPoints: parseInt(row[7]) || 0,
        scorekeeper: row[8] || '',
        verified: row[9] || 'Pending'
      }));

    return res.status(200).json(scores);
  } catch (error) {
    console.error('Get scores error:', error);
    return res.status(500).json({ error: error.message });
  }
};
