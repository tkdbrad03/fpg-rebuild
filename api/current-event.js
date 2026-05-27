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
    
    // Set timeMin to 2 days ago to bypass any strict timezone boundary drops
    const searchDate = new Date();
    searchDate.setDate(searchDate.getDate() - 2);
    
    const eventsRes = await calendar.events.list({
      calendarId: 'floridaplayersgroup25@gmail.com', 
      timeMin: searchDate.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = eventsRes.data.items || [];
    
    // Strict Match Sequence: Match the prefix rule
    const fpgEvent = events.find(e => e.summary && e.summary.startsWith('Florida Players - '));
    
    if (!fpgEvent) {
      return res.status(200).json({ eventString: '', date: '' });
    }
    
    // Handle both all-day dates (e.g. 2026-05-30) and specific dateTimes
    let eventDateStr = '';
    if (fpgEvent.start) {
      eventDateStr = fpgEvent.start.date || (fpgEvent.start.dateTime ? fpgEvent.start.dateTime.split('T')[0] : '');
    }
    
    // Fallback: Force clean standard layout string if missing a comma
    let dynamicEventString = fpgEvent.summary;
    if (!dynamicEventString.includes(',') && eventDateStr) {
      const dateObj = new Date(eventDateStr + 'T00:00:00');
      const monthStr = dateObj.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
      const dayStr = dateObj.getUTCDate();
      dynamicEventString = `${fpgEvent.summary}, ${monthStr} ${dayStr}`;
    }
    
    return res.status(200).json({
      eventString: dynamicEventString,
      date: eventDateStr
    });
  } catch (error) {
    console.error("Calendar Engine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
