import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";

export const startupRouter = createTRPCRouter({
 

  createStartupUpdateUser: protectedProcedure
    .input(z.object({ 
        startupName : z.string(),
        startupEmail : z.string().email(),
        industry : z.string(),
        website : z.string().url(),
        linkedInUrl : z.string().url(),
        role : z.enum(["STUDENT", "MENTOR", "STARTUP"]),
        name : z.string(),
        avatarUrl : z.string(),
     }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction([
        ctx.db.startup.create({
          data: {
              startupName : input.startupName,
              startupEmail : input.startupEmail,
              industry : input.industry,
              website : input.website,
              linkedInUrl : input.linkedInUrl,
              userId: ctx?.dbUser?.id!,
          },
        }),
        ctx.db.user.update({
          where: { id: ctx?.dbUser?.id! },
          data: {
            name: input.name,
            avatarUrl: input.avatarUrl,
            role: "STARTUP",
            isRegistered: true,
          },
        }),
      ])
     
        
      
    }),

  updateStartup: protectedProcedure
  .input(z.object({
    startupName : z.string(),
    startupEmail : z.string().email(),
    industry : z.string(),
    website : z.string().url(),
    linkedInUrl : z.string().url(),
  }))
  .mutation(async ({ ctx, input }) => {
    return ctx.db.startup.update({
      where: { userId: ctx?.dbUser?.id },
      data: input,
    });
  }
  ),

  deleteStartup: protectedProcedure
  .mutation(async ({ ctx }) => {
    return ctx.db.startup.delete({
      where: { userId: ctx?.dbUser?.id },
    });
  }
  ),

  getStartup: protectedProcedure
  .query(async ({ ctx }) => {
    return ctx.db.startup.findUnique({
      where: { userId: ctx?.dbUser?.id },
    });
  }
  ),


    
  })

