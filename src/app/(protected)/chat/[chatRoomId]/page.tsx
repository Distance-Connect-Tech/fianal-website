import { api } from '@/trpc/server'
import React from 'react'
import Chat from './_components/Chat'
import { db } from '@/server/db'
import { auth0 } from "@/lib/auth0";
const page = async ({params} : {params: {chatRoomId : string}}) => {
  const session = await auth0.getSession();
  const userId = session?.user.sub;

  
  const {chatRoomId} = params

  let chatRoom = await api.chatRoom.getChatRoomById({chatRoomId})
  console.log("chatRoom", chatRoom)
  
  const initialMessages = await db.chatMessage.findMany({
    where: { chatRoomId: chatRoomId},
    orderBy: { createdAt: 'asc' }
  });


 
  
  const chatRoomDetails = {
    chatRoomId: chatRoom?.id || "",
    mentorUserId: chatRoom?.mentorUserId || "",
    studentUserId: chatRoom?.studentUserId || ""
  }


    
  return (
    <div>
      {/* <Chat chatRoomDetails={chatRoomDetails!}/> */}
      <Chat 
      chatRoomId={chatRoomId}
      initialMessages={initialMessages}
      userId={userId!}
    />
    </div>
  )
}

export default page