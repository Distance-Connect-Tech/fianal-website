// app/api/create-event/route.ts
import { google, calendar_v3 } from 'googleapis';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

interface EventRequestBody {
  summary: string;
  startTime: string;
  endTime: string;
  attendees: string[];
}

interface GoogleMeetResponse {
  meetLink: string;
}

export async function POST(request: Request) {
  try {
    const { summary, startTime, endTime, attendees } = await request.json() as EventRequestBody;

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Missing Google service account credentials');
    }

    // Create JWT client with correct typing
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    // Initialize Calendar API with proper typing
    const calendar = google.calendar({
      version: 'v3',
      auth: auth,
    });

    // Create event payload
    const event: calendar_v3.Schema$Event = {
      summary,
      start: {
        dateTime: startTime,
        timeZone: 'UTC',
      },
      end: {
        dateTime: endTime,
        timeZone: 'UTC',
      },
      attendees: attendees.map(email => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(7),
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    // Insert event
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    // Return meet link
    return NextResponse.json<GoogleMeetResponse>({
      meetLink: response.data.hangoutLink || '',
    });

  } catch (error: unknown) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create Google Meet event' },
      { status: 500 }
    );
  }
}