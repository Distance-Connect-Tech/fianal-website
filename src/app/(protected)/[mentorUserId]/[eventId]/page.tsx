import React from 'react'
import MeetingTimeDateSelection from '../_components/MeetingTimeDateSelection'
import { api } from '@/trpc/server';
import { db } from '@/server/db';

async function SharedMeetingEvent({params }: {params: {mentorUserId: string, eventId: string}}) {
  
  const { mentorUserId, eventId } = await params;



    const eventDetails = await api.meetingEvent.getMeetingEventById({id: eventId});

    const updatedEventDetails = {
      description: eventDetails?.description ?? '',
      id: eventDetails?.id ?? '',
      eventName: eventDetails?.eventName ?? "",
      duration: eventDetails?.duration ?? 0,
      meetEmail: eventDetails?.meetEmail ?? "",
    };


    const mentorUserDetails = await db.user.findUnique({
      where: {
        id: mentorUserId
      },
      select: {
        email: true,
        name: true,
        
        mentor: {
          select: {
            availability: true
          }
        }
      }
    })

    
    const updatedMentorUserDetails = {
      mentorUserId: mentorUserId,
      email : mentorUserDetails?.email ?? '',
      name : mentorUserDetails?.name ?? '',
      daysAvailable : mentorUserDetails?.mentor?.availability?.daysAvailable ?? {},
    }

  return (
    <div>
        <MeetingTimeDateSelection eventInfo={updatedEventDetails}
        mentorUserDetails={updatedMentorUserDetails}
         />
    </div>
  )
}

export default SharedMeetingEvent