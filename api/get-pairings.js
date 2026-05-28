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
      range: 'Pairings!A2:J'
      // A: Date, B: Course, C: Group#, D: PlayerName, E: TeeTime
      // F: ScorekeeperNote, G: Handicap, H: Quota, I: GamingCoord, J: Strokes
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.status(200).json({ published: false, groups: [] });
    }

    // Also fetch checkin data to get game selections
    const checkinRes = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'CheckIns2!B2:F'
      // B: Event, C: PlayerName, D: GuestNames, E: QuickSelection, F: IndividualGames
    });

    const checkinRows = checkinRes.data.values || [];
    const gamesMap = {};
    checkinRows.forEach(row => {
      const playerName = row[1] || '';
      const quickSel = row[3] || '';
      const indGames = row[4] || '';
      if (playerName) {
        gamesMap[playerName] = quickSel.includes('ALL IN') ? 'ALL IN' : (indGames || quickSel);
      }
    });

    // Group rows by group number
    const groupsMap = {};
    rows.forEach(row => {
      const [date, course, groupNum, playerName, teeTime, skNote, handicap, quota, gcNote, strokes] = row;
      if (!groupNum || !playerName) return;

      if (!groupsMap[groupNum]) {
        groupsMap[groupNum] = {
          groupNumber: groupNum,
          teeTime: teeTime || '',
          date: date || '',
          course: course || '',
          players: []
        };
      }

      groupsMap[groupNum].players.push({
        name: playerName,
        handicap: parseFloat(handicap) || 0,
        quota: parseInt(quota) || 0,
        strokes: parseInt(strokes) || 0,
        isScorekeeper: skNote && skNote.startsWith('SK'),
        isGamingCoord: gcNote === 'GC',
        games: gamesMap[playerName] || ''
      });
    });

    const groups = Object.values(groupsMap).sort((a, b) =>
      parseInt(a.groupNumber) - parseInt(b.groupNumber)
    );

    return res.status(200).json({
      published: true,
      date: rows[0]?.[0] || '',
      course: rows[0]?.[1] || '',
      groups,
      totalGroups: groups.length
    });

  } catch (error) {
    console.error('Get pairings error:', error);
    return res.status(500).json({ error: error.message });
  }
};
