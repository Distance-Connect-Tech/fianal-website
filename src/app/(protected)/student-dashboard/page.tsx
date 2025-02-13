import React from 'react'
import MentorList from './MentorList'
import ScheduledMeets from './ScheduledMeets'
import ChatRooms from './ChatRooms'
import { api } from '@/trpc/server'

const page = async () => {

  const chatRooms = await api.chatRoom.getChatRoomByStudentId();

 
  return (
    <div>
      <h1>Student Dashboard</h1>

      <h2>MENTORS LIST</h2>
      <MentorList/>
      <ScheduledMeets/>
            {/* Chatrooms Section */}
     <section className="grid p-10 grid-cols-1 md:grid-cols-2 gap-6">
             {chatRooms.map((room) => (
               
              <ChatRooms key={room.id} room={room}/>
             ))}
           </section>

    </div>
  )
}

export default page