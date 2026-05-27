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
    
    // Look from the start of the current week to safely capture the upcoming Saturday round
    const searchDate = new Date();
    searchDate.setHours(0, 0, 0, 0);
    searchDate.setDate(searchDate.getDate() - 3);
    
    const eventsRes = await calendar.events.list({
      calendarId: 'floridaplayersgroup25@gmail.com', 
      timeMin: searchDate.toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: 'startTime',
    });
    
    const events = eventsRes.data.items || [];
    console.log("DEBUG - Total events found:", events.length);
    events.forEach((e, idx) => console.log(`Event [${idx}]: "${e.summary}" | Start:`, JSON.stringify(e.start)));
    
const fpgEvent = events.find(e => e.summary && /^Florida Players\s*[-–—]\s*/.test(e.summary.trim()));    
    if (!fpgEvent) {
      return res.status(200).json({ eventString: '', date: '' });
    }
    
    // Cleanly pull the precise short-date string from the dateTime string
const eventDateStr = fpgEvent.start.dateTime ? fpgEvent.start.dateTime.split('T')[0] : (fpgEvent.start.date || '');
    
    // Build the non-negotiable clean layout string if a comma format isn't present
    let dynamicEventString = fpgEvent.summary;
    if (!dynamicEventString.includes(',') && eventDateStr) {
  const [year, month, day] = eventDateStr.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const monthStr = dateObj.toLocaleString('en-US', { month: 'long' });
  const dayNum = dateObj.getDate();
  dynamicEventString = `${fpgEvent.summary}, ${monthStr} ${dayNum}`;
}
    
    return res.status(200).json({
      eventString: dynamicEventString, // Forces: "Florida Players - Greenfield Plantation, May 30"
      date: eventDateStr
    });
  } catch (error) {
    console.error("Calendar Engine Error:", error);
    return res.status(500).json({ error: error.message });
  }
};
