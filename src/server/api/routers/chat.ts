import { z } from 'zod';
import { createTRPCRouter, protectedProcedure,  } from '@/server/api/trpc';
import { getAblyChannel } from '@/lib/ably';
import { storage } from '@/lib/gcp-storage';


const getSignedUrl = async (path: string) => {
  const [url] = await storage.bucket(process.env.GCP_CHAT_IMAGE_BUCKET_NAME!)
    .file(path)
    .getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 3600 * 1000 // 1 hour
    });
  return url;
};

export const chatRouter = createTRPCRouter({
  
  sendMessage: protectedProcedure
  .input(z.object({
    message: z.string(),
    chatRoomId: z.string(),
    imageId : z.string().optional(),
    imagePath : z.string().optional()
  }))
  .mutation(async ({ input, ctx }) => {
    const { message, chatRoomId , imageId, imagePath } = input;

    // Ensure the user is authenticated
    if (!ctx.dbUser) {
      throw new Error("User not authenticated");
    }
    // console.log(ctx.dbUser.role)
    // Check if the chat room exists
    const chatRoom = await ctx.db.chatRoom.findUnique({
      where: { id: chatRoomId },
    });
    if (!chatRoom) {
      throw new Error("Chat room not found");
    }
    if (![chatRoom.studentUserId, chatRoom.mentorUserId].includes(ctx.dbUser.id)) {
      throw new Error("Not part of this chat");
    }

    
    // Use a transaction for database writes
    const [chatMessage] = await ctx.db.$transaction([
      ctx.db.chatMessage.create({
        data: {
          senderId: ctx.dbUser.id,
          senderRole: ctx.dbUser.role,
          message,
          chatRoomId,
          imageId,
          imagePath 
        },
      }),

      ctx.db.chatRoom.update({
        where: { id: chatRoomId },
        data: {
          lastMessage: message,
          mentorUnreadCount: ctx.dbUser.role === "STUDENT" ? { increment: 1 } : 0,
          studentUnreadCount: ctx.dbUser.role === "MENTOR" ? {set : chatRoom.studentUnreadCount + 1} : 0,
        },
      }),
    ]);

   
    

    // Publish the message to Ably  
    try {
      const channel = getAblyChannel(chatRoomId);
      
      await channel.publish("message", {
        message: chatMessage.message,
        imageId : chatMessage.imageId,
        senderRole: chatMessage.senderRole,
        createdAt: chatMessage.createdAt,
        imageUrl : chatMessage.imagePath ? await getSignedUrl(chatMessage?.imagePath) : null

      });
    } catch (error) {
      console.error("Failed to publish message:", error);
    }

    return chatMessage;
  }),

    getMessages: protectedProcedure
    .input(z.object({
      chatRoomId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { chatRoomId } = input;

      // Get the messages from the database
      const messages = await ctx.db.chatMessage.findMany({
        where: {
          chatRoomId : chatRoomId,
        },
      
        select:{
          message: true,
          senderRole: true,
          createdAt: true,
          id: true,
          
          
        }
      });

      return messages;
    }),
});