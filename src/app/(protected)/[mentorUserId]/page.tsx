"use client"
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/react';
import Link from 'next/link';
import React from 'react'

const page = ({params} : {params: {mentorUserId: string}}) => {
  const { mentorUserId } = React.use(params)
  const { data: chatRoom } = api.chatRoom.getChatRoomByMentorAndStudentId.useQuery({ mentorUserId });
  const {data : mentor, isError, isLoading} = api.mentor.getMentorByUserId.useQuery({userId: mentorUserId});
  const createChatRoomMutation = api.chatRoom.createChatRoom.useMutation({
    onSuccess : () => {
      console.log("Chat Room Created")
    },
    onError : (error) => {
      console.log("Error", error)
    }
  })
    if(isLoading) return <div>Loading...</div>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">{mentor?.mentorName}</CardTitle>
          <p className="text-gray-500">{mentor?.jobTitle} at {mentor?.currentCompany}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="font-medium">Experience: {mentor?.experience} years</p>
            <p className="font-medium">Industry: {mentor?.industry}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Hiring Fields</h3>
            <div className="flex gap-2 flex-wrap">
              {mentor?.hiringFields.map((field) => (
                <Badge key={field} className="bg-blue-500 text-white">{field}</Badge>
              ))}
            </div>
          </div>
          <div className='mb-6'>
            <h3 className="font-semibold mb-2">Meeting Events</h3>
            <ul className="list-disc list-inside text-gray-700">
              {mentor?.meetingEvents.map((event) => (
                <Link href={`${mentorUserId}/${event?.id}`} key={event.id}>{event.eventName}</Link>
              ))}
            </ul>
          </div>
          <Button className='mt-6' onClick={async () => {
            
            console.log("chatRoom", chatRoom);
            if (!chatRoom) {
             const chatRoom = await createChatRoomMutation.mutateAsync({ mentorUserId });
             console.log("chatRoom", chatRoom);
             return window.location.href = `chat/${chatRoom?.id}`;
            }
            console.log("chatRoom", chatRoom);
            return window.location.href = `chat/${chatRoom?.id}`;
          }}>
            Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default page