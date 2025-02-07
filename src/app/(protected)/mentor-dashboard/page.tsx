import { api } from '@/trpc/server';
import Link from 'next/link';
import React from 'react';
// Adjust these imports according to your shadcn/ui component paths
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatRooms from './_components/chatRooms';

const Page = async () => {

  const chatRooms = await api.chatRoom.getChatRoomByMentorId();
  console.log(chatRooms);

  


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
      </header>

      {/* Chatrooms Section */}
     <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {chatRooms.map((room) => (
               
              <ChatRooms key={room.id} room={room}/>
             ))}
           </section>

      {/* Footer / Navigation */}
      <footer className="mt-8">
        <Link href="/mentor-dashboard/meeting">
          <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Go to Meeting
          </div>
        </Link>
      </footer>
    </div>
  );
};

export default Page;
