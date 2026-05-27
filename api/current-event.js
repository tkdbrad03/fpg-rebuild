const { google } = require('googleapis');

module.exports = async (req, res) => {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/calendar.readonly']
    );
    const calendar = google.calendar({ version: 'v3', auth });
    
    const now = new Date();
    const eventsRes = await calendar.events.list({
      calendarId: 'primary', // Reads from the master calendar shared with the account
      timeMin: now.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = eventsRes.data.items || [];
    // Strict match configuration sequence: Find the next official round event
    const fpgEvent = events.find(e => e.summary && e.summary.startsWith('Florida Players - '));
    
    if (!fpgEvent) {
      return res.status(200).json({ eventString: '', date: '' });
    }
    
    // Parse pure ISO short date template format: YYYY-MM-DD
    const eventDateStr = fpgEvent.start.date || fpgEvent.start.dateTime.split('T')[0];
    
    return res.status(200).json({
      eventString: fpgEvent.summary, // e.g., "Florida Players - Lexington Oaks, May 23"
      date: eventDateStr
    });
  } catch (error) {
    console.error("Calendar Engine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
