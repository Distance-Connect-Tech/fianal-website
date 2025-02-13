"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/trpc/react';
import React from 'react'

type Room = {
    id: string;
    student: {
        studentName: string | null;
    };
    mentor: {
        mentorName: string | null;
    };
    lastMessage: string;
    studentUnreadCount: number;
}

const ChatRooms = ({room} : {room : Room}) => {


const mentorUnreadCountToZeroMutation = api.chatRoom.studentUnreadCountToZero.useMutation()

  return (
    <Card key={room.id} className="border border-gray-200 shadow-sm">
    <CardHeader>
      <CardTitle className="text-xl font-semibold">
        <button onClick={async() => {
          await mentorUnreadCountToZeroMutation.mutateAsync({chatRoomId : room.id});
          window.location.href = `chat/${room.id}`;
        }} 
        >
        Chat with {room.mentor.mentorName}
        </button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-700">
        Last Message: <span className="font-medium">{room.lastMessage}</span>
      </p>
      {room.studentUnreadCount > 0 && (
        <div className="mt-2">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-red-500 text-white rounded">
            {room.studentUnreadCount} Unread
          </span>
        </div>
      )}
    </CardContent>
  </Card>
  )
}

export default ChatRooms