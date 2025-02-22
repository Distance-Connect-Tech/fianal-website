
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const chatRoomRouter = createTRPCRouter({
 
//create a chat room

createChatRoom: protectedProcedure
    .input(z.object({
        mentorUserId: z.string(),
    }))
    .mutation(({ ctx, input }) => {
        return ctx.db.chatRoom.create({
            data: {
                mentorUserId: input.mentorUserId,
                studentUserId : ctx.dbUser!.id,
                lastMessage: "",
                mentorUnreadCount: 0,
                studentUnreadCount: 0,

            },
        });
    }),

//get chat room by mentor id
getChatRoomById: protectedProcedure
    .input(z.object({
        chatRoomId: z.string(),
    }))
    .query(({ ctx, input }) => {
        return ctx.db.chatRoom.findFirst({
            where: {
                id: input.chatRoomId,
            },
            select : {
                mentorUserId :true,
                studentUserId : true,
                lastMessage : true,
                mentorUnreadCount : true,
                studentUnreadCount : true,
                id: true,
                student : true

                
            }
        });
    }),

    getChatRoomByMentorAndStudentId: protectedProcedure
    .input(z.object({
        mentorUserId: z.string(),
    }))
    .query(({ ctx, input }) => {
        return ctx.db.chatRoom.findFirst({
            where: {
                mentorUserId: input.mentorUserId,
                studentUserId: ctx.dbUser!.id,
            },
        });
    }),

    getChatRoomByMentorId: protectedProcedure
    .query(({ ctx }) => {
        return ctx.db.chatRoom.findMany({
            where: {
                mentorUserId: ctx.dbUser!.id,
            },
            select: {
                id: true,
                lastMessage: true,
                mentorUnreadCount: true,
                mentor : {
                    select : {
                        mentorName : true,
                    }
                },
                student : {
                    select : {
                        studentName : true,
                    }
                }
            }
        });
    }),
    getChatRoomByStudentId: protectedProcedure
    .query(({ ctx }) => {
        return ctx.db.chatRoom.findMany({
            where: {
                studentUserId: ctx.dbUser!.id,
            },
            select: {
                id: true,
                lastMessage: true,
               studentUnreadCount: true,
                mentor : {
                    select : {
                        mentorName : true,
                    }
                },
                student : {
                    select : {
                        studentName : true,
                    }
                }
            }
        });
    }),

    mentorUnreadCountToZero : protectedProcedure
    .input(z.object({
        chatRoomId : z.string(),
    }))
    .mutation(({ctx, input}) => {
        return ctx.db.chatRoom.update({
            where: {
                id: input.chatRoomId,
            },
            data: {
                mentorUnreadCount : 0,
            },
        });
    }),

    studentUnreadCountToZero : protectedProcedure
    .input(z.object({
        chatRoomId : z.string(),
    }))
    .mutation(({ctx, input}) => {
        return ctx.db.chatRoom.update({
            where: {
                id: input.chatRoomId,
            },
            data: {
                studentUnreadCount : 0,
            },
        });
    }),



    
  })

