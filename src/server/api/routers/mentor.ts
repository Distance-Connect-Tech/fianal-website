import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const mentorRouter = createTRPCRouter({
 

  createMentorUpdateUser: protectedProcedure
    .input(z.object({ 
      currentCompany : z.string(),
      jobTitle : z.string(),
      experience : z.string(),
      industry : z.string(),
      pinCode : z.number(),
      state : z.string(),
      name : z.string(),
      role : z.enum(["STUDENT", "MENTOR", "STARTUP"]),
      isRegistered : z.boolean(),
      avatarUrl : z.string(),
      hiringFields : z.array(z.string()),
     }))


    .mutation(async ({ ctx, input }) => {

      return await ctx.db.$transaction([
        ctx.db.mentor.create({
          data: {
            currentCompany : input.currentCompany,
            jobTitle : input.jobTitle,
            experience : input.experience,
            industry : input.industry,
              pinCode : input.pinCode,
              state : input.state,
              userId: ctx?.dbUser?.id!, 
              mentorName : input.name,
              hiringFields : input.hiringFields,
          },
        }),
        ctx.db.user.update({
          where: { id: ctx?.dbUser?.id! },
          data: {
            name: input.name,
            role: input.role,
            isRegistered: input.isRegistered,
            avatarUrl: input.avatarUrl,
          },
        })
      ])
      
    }),

  // updateMentor: protectedProcedure
  // .input(z.object({
  //   positionTitle : z.string(),
  //   industryExperience : z.string(),
  //   yearsOfExperience : z.string(),
  // linkedInUrl : z.string().url(),
  // professionalIdUrl : z.string().url(),
  // companyEmail : z.string().email(),
  // }))
  // .mutation(async ({ ctx, input }) => {
  //   return ctx.db.student.update({
  //     where: { userId: ctx?.dbUser?.id },
  //     data: input,
  //   });
  // }
  // ),

  // deleteMentor: protectedProcedure
  // .mutation(async ({ ctx }) => {
  //   return ctx.db.student.delete({
  //     where: { userId: ctx?.dbUser?.id },
  //   });
  // }
  // ),

  // getMentor: protectedProcedure
  // .query(async ({ ctx }) => {
  //   return ctx.db.student.findUnique({
  //     where: { userId: ctx?.dbUser?.id },
  //   });
  // }
  // ),

  getAllMentors: publicProcedure
  .query(async ({ ctx }) => {
    return ctx.db.mentor.findMany({
      select: {
        userId: true,
        mentorName: true,
        currentCompany: true,
        jobTitle: true,
        experience: true,
        industry: true,
        hiringFields: true,
        meetingEvents: {
          select: {
            id: true,
            eventName: true,
          }
        }
      }
    })
  }),

  getMentorByUserId: publicProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.db.mentor.findUnique({
      where: { userId: input.userId },
      select : {
        userId: true,
        mentorName: true,
        currentCompany: true,
        jobTitle: true,
        experience: true,
        industry: true,
        hiringFields: true,
        meetingEvents : {
          select : {
            id : true,
            eventName : true,
          }
        }
      }
    });

  })



    
  })

