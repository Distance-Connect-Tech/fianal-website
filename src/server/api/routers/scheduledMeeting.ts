import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const scheduledMeetingsRouter = createTRPCRouter({

  createScheduledMeeting: protectedProcedure
    .input(z.object({ 
       mentorUserId : z.string(),
       selectedTime : z.string(),
        selectedDate : z.date(),
        formatedDate : z.string(),
        formatedTimeStamp : z.string(),
        duration : z.number(),
        meetUrl : z.string().url(),
        eventId : z.string(),
        userNote : z.string()
      
     }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.scheduledMeetings.create({
        data : {
            mentorUserId : input.mentorUserId,
            selectedTime : input.selectedTime,
            selectedDate : input.selectedDate,
            formatedDate : input.formatedDate,
            formatedTimeStamp : input.formatedTimeStamp,
            duration : input.duration,
            meetUrl : input.meetUrl,
            eventId : input.eventId,
            userNote : input.userNote,
            studentUserId : ctx.dbUser!.id
        }
      })
    }),

    getScheduledMeetingsList: protectedProcedure
    .input(z.object({ 
        selectedDate : z.date(),
        eventId : z.string()
     }))
    .query(async ({ ctx, input }) => {
      return ctx.db.scheduledMeetings.findMany({
        where: {
          selectedDate: input.selectedDate, 
            eventId: input.eventId,
        },
      });
    }),

    getScheduledMeetingsListByMentor: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.scheduledMeetings.findMany({
        where: {
          mentorUserId: ctx.dbUser!.id
        },
      });
    }),


    getScheduledMeetingsListByStudent: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.scheduledMeetings.findMany({
        where: {
          studentUserId: ctx.dbUser!.id
        },
      });
    }),

 
  })