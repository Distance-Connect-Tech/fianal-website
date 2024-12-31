import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const studentRouter = createTRPCRouter({
 

  createStudentUpdateUser: protectedProcedure
    .input(z.object({ 
      university : z.string(),
      course : z.string(),
      yearOfStudy : z.enum(["FIRST", "SECOND", "THIRD", "FOURTH"]),
      linkedInUrl : z.string(),
      role : z.enum(["STUDENT", "MENTOR", "STARTUP"]),
      isRegistered : z.boolean(),
      avatarUrl : z.string(),
      name : z.string(),
     }))
    .mutation(async ({ ctx, input }) => {

      return await ctx.db.$transaction([
        ctx.db.student.create({
          data: {
              userId : ctx?.dbUser?.id!,
              university: input.university,
              course: input.course,
              yearOfStudy: input.yearOfStudy,
              linkedInUrl: input.linkedInUrl,

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
        }),
      ])
    }),

  updateStudent: protectedProcedure
  .input(z.object({
      university : z.string(),
      course : z.string(),
      yearOfStudy : z.enum(["FIRST", "SECOND", "THIRD", "FOURTH"]),
      linkedInUrl : z.string(),
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.student.update({
      where: { userId: ctx?.dbUser?.id },
      data: input,
    });
  }
  ),

  deleteStudent: protectedProcedure
  .mutation(async ({ ctx }) => {
    return ctx.db.student.delete({
      where: { userId: ctx?.dbUser?.id },
    });
  }
  ),

  getStudent: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.student.findUnique({
      where: { userId: ctx?.dbUser?.id },
    });
  }
  ),


    
  })

