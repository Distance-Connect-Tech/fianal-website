"use client";
import { api } from '@/trpc/react';
import React from 'react'

const MentorList = () => {
    const [mentors, setMentors] = React.useState([]);
    const {data, isError, isLoading} = api.mentor.getAllMentors.useQuery();
    
  return (
    <div>
        {isLoading && <div>Loading...</div>}
        {isError && <div>Error</div>}
        {data && data.map((mentor) => {
          const eventId = mentor.mentor?.meetingEvents?.map((event) => {
            return {
              id: event.id,
              eventName: event.eventName
            }
          } );
          // console.log(eventId)
        return(

            <div key={mentor.id} className='border p-4 my-2'>
              <a href={`/${mentor.id}`} className='text-blue-500'>{mentor.name}</a>
              <div className='font-semibold'>Events</div>
              {
                eventId?.map((event) => {
                  return <div>
                    <a target='_blank' href={`/${mentor.id}/${event.id}`}>{event.eventName}</a>
                  </div>
                })
              }
                <h3 className='font-bold'>{mentor.name}</h3>
                <h3>{mentor.mentor?.companyEmail}</h3>
            </div>
        )}
        )}

    </div>
  )
}

export default MentorList