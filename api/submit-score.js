const { google } = require('googleapis');

// Google Sheets configuration
const LIVE_SCORES_SHEET = 'Live Scores';

function getAuth() {
  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  return new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
  );
}

/**
 * Submit score entry to Google Sheets
 * Expected body format:
 * {
 *   courseName: "Diamond Hill Golf Club",
 *   roundDate: "2025-12-06",
 *   group: "1",
 *   playerName: "John Doe",
 *   hole: 1,
 *   score: 5,
 *   stablefordPoints: 1,
 *   scorekeeper: "Jane Smith",
 *   verified: "Pending" | "Verified"
 * }
 * 
 * Column structure:
 * A: Timestamp
 * B: Course Name
 * C: Round Date
 * D: Group
 * E: Player Name
 * F: Hole
 * G: Score
 * H: Stableford Points
 * I: Scorekeeper
 * J: Verified
 */
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return handleSubmitScore(req, res);
  }

  if (req.method === 'GET') {
    return handleGetScores(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

async function handleSubmitScore(req, res) {
  try {
    const {
      courseName,
      roundDate,
      group,
      playerName,
      hole,
      score,
      stablefordPoints,
      scorekeeper,
      verified = 'Pending'
    } = req.body;

    // Validation
    if (!roundDate || !group || !playerName || !hole || score === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['roundDate', 'group', 'playerName', 'hole', 'score']
      });
    }

    // Get auth client
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    // Check if this exact entry already exists
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${LIVE_SCORES_SHEET}!A2:J`
    });

    const rows = existingData.data.values || [];
    let rowToUpdate = -1;

    // Look for existing entry with same courseName, roundDate, group, playerName, hole
    // New column structure: B=CourseName, C=RoundDate, D=Group, E=PlayerName, F=Hole
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowCourseName = row[1];
      const rowRoundDate = row[2];
      const rowGroup = row[3];
      const rowPlayerName = row[4];
      const rowHole = row[5];
      
      if (rowCourseName === courseName &&
          rowRoundDate === roundDate && 
          rowGroup === group && 
          rowPlayerName === playerName && 
          rowHole == hole) {
        rowToUpdate = i + 2; // +2 for header row and 0-index conversion
        break;
      }
    }

    const timestamp = new Date().toISOString();
    const newRow = [
      timestamp,          // A: Timestamp
      courseName || '',   // B: Course Name
      roundDate,          // C: Round Date
      group,              // D: Group
      playerName,         // E: Player Name
      hole,               // F: Hole
      score,              // G: Score
      stablefordPoints,   // H: Stableford Points
      scorekeeper,        // I: Scorekeeper
      verified            // J: Verified
    ];

    if (rowToUpdate > 0) {
      // Update existing row
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${LIVE_SCORES_SHEET}!A${rowToUpdate}:J${rowToUpdate}`,
        valueInputOption: 'RAW',
        resource: {
          values: [newRow]
        }
      });
    } else {
      // Append new row
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: `${LIVE_SCORES_SHEET}!A:J`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
          values: [newRow]
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: rowToUpdate > 0 ? 'Score updated' : 'Score submitted',
      data: {
        courseName,
        roundDate,
        group,
        playerName,
        hole,
        score,
        stablefordPoints,
        scorekeeper,
        verified,
        timestamp
      }
    });

  } catch (error) {
    console.error('Error submitting score:', error);
    return res.status(500).json({
      error: 'Failed to submit score',
      details: error.message
    });
  }
}

async function handleGetScores(req, res) {
  try {
    const { courseName, roundDate, group } = req.query;

    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${LIVE_SCORES_SHEET}!A2:J`
    });

    let scores = response.data.values || [];

    // Filter by courseName, roundDate and/or group if provided
    if (courseName) {
      scores = scores.filter(row => row[1] === courseName);
    }
    if (roundDate) {
      scores = scores.filter(row => row[2] === roundDate);
    }
    if (group) {
      scores = scores.filter(row => row[3] === group);
    }

    // Transform to object format (new column structure)
    const formattedScores = scores.map(row => ({
      timestamp: row[0],
      courseName: row[1],
      roundDate: row[2],
      group: row[3],
      playerName: row[4],
      hole: parseInt(row[5]) || 0,
      score: parseInt(row[6]) || 0,
      stablefordPoints: parseInt(row[7]) || 0,
      scorekeeper: row[8],
      verified: row[9] || 'Pending'
    }));

    return res.status(200).json({
      success: true,
      count: formattedScores.length,
      scores: formattedScores
    });

  } catch (error) {
    console.error('Error getting scores:', error);
    return res.status(500).json({
      error: 'Failed to get scores',
      details: error.message
    });
  }
}
