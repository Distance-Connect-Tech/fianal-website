import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const mentorRouter = createTRPCRouter({
 

  createMentorUpdateUser: protectedProcedure
    .input(z.object({ 
        positionTitle : z.string(),
        industryExperience : z.string(),
        yearsOfExperience : z.string(),
      linkedInUrl : z.string().url(),
      professionalIdUrl : z.string().url(),
      companyEmail : z.string().email(),
      name : z.string(),
      role : z.enum(["STUDENT", "MENTOR", "STARTUP"]),
      isRegistered : z.boolean(),
      avatarUrl : z.string(),
     }))


    .mutation(async ({ ctx, input }) => {

      return await ctx.db.$transaction([
        ctx.db.mentor.create({
          data: {
              positionTitle : input.positionTitle,
              industryExperience : input.industryExperience,
              yearsOfExperience : input.yearsOfExperience,
              linkedInUrl : input.linkedInUrl,
              professionalIdUrl : input.professionalIdUrl,
              companyEmail : input.companyEmail,
              userId: ctx?.dbUser?.id!, 
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

  updateMentor: protectedProcedure
  .input(z.object({
    positionTitle : z.string(),
    industryExperience : z.string(),
    yearsOfExperience : z.string(),
  linkedInUrl : z.string().url(),
  professionalIdUrl : z.string().url(),
  companyEmail : z.string().email(),
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.student.update({
      where: { userId: ctx?.dbUser?.id },
      data: input,
    });
  }
  ),

  deleteMentor: protectedProcedure
  .mutation(async ({ ctx }) => {
    return ctx.db.student.delete({
      where: { userId: ctx?.dbUser?.id },
    });
  }
  ),

  getMentor: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.student.findUnique({
      where: { userId: ctx?.dbUser?.id },
    });
  }
  ),

  getAllMentors: publicProcedure
  .query(async ({ ctx }) => {
    return ctx.db.user.findMany(
      {
        where: {
          role: "MENTOR"
        },
        select:{
          id : true,
          name : true,
          mentor : {
            select : {
              positionTitle : true,
              industryExperience : true,
              yearsOfExperience : true,
              linkedInUrl : true,
              professionalIdUrl : true,
              companyEmail : true,
            }
          }
        }
      } 
    );
  }
  ),


    
  })

