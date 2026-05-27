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
      calendarId: 'primary', 
      timeMin: now.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = eventsRes.data.items || [];
    
    // Matches your calendar syntax seamlessly
    const fpgEvent = events.find(e => e.summary && e.summary.startsWith('Florida Players - '));
    
    if (!fpgEvent) {
      return res.status(200).json({ eventString: '', date: '' });
    }
    
    // Parse pure ISO short date template format: YYYY-MM-DD
    const eventDateStr = fpgEvent.start.date || fpgEvent.start.dateTime.split('T')[0];
    
    // Fallback: If title doesn't contain a comma, format one dynamically from the date
    let dynamicEventString = fpgEvent.summary;
    if (!dynamicEventString.includes(',')) {
      const dateObj = new Date(eventDateStr + 'T00:00:00');
      const monthStr = dateObj.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
      const dayStr = dateObj.getUTCDate();
      dynamicEventString = `${fpgEvent.summary}, ${monthStr} ${dayStr}`;
    }
    
    return res.status(200).json({
      eventString: dynamicEventString, // Dynamically forces: "Florida Players - Greenfield Plantation, May 30"
      date: eventDateStr
    });
  } catch (error) {
    console.error("Calendar Engine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
