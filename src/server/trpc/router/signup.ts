import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

//create a mutation
export const signupRouter = router({
  signup: protectedProcedure
    .input(
      z.object({
        mmr: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (user?.banned === false) {
        const signUp = await ctx.prisma.signup.create({
          data: {
            userId: ctx.session.user.id,
          },
        });
        const AddMMR = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            mmr: input.mmr,
          },
        });
        return {
          user,
          signUp,
          AddMMR,
        };
      } else {
        return {
          messege: 'You are banned',
        };
      }
    }),
  getAllSignups: protectedProcedure.query(async ({ ctx }) => {
    const signups = await ctx.prisma.signup.findMany({
      include: {
        user: true,
      },
    });
    return signups;
  }),

  removeSignupFromTeam: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const removeFromTeam = await ctx.prisma.signup.update({
        where: {
          id: input.id,
        },
        data: {
          teamId: null,
        },
      });
      return removeFromTeam;
    }),

  addSignupToTeam: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        teamId: z.number(),
        soldFor: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const addToTeam = await ctx.prisma.signup.update({
        where: {
          id: input.id,
        },
        data: {
          teamId: input.teamId,
          soldFor: input.soldFor,
        },
      });
      return addToTeam;
    }),
});
