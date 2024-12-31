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
        {data && data.map((mentor) => (
            <div key={mentor.id} className='border p-4 my-2'>
                <h3 className='font-bold'>{mentor.name}</h3>
                <h3>{mentor.mentor?.companyEmail}</h3>
            </div>
        )
        )}

    </div>
  )
}

export default MentorList