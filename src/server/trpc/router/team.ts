import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

//create a mutation
export const teamRouter = router({
  createTeam: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        captain: z.number(),
        division: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const team = await ctx.prisma.team.create({
        data: {
          divisionId: input.division,
          name: input.name,
          captainId: input.captain,
          drafterId: input.captain,
        },
      });

      const addCaptain = await ctx.prisma.signup.update({
        where: {
          id: input.captain,
        },
        data: {
          teamId: team.id,
        },
      });

      return {
        team,
        addCaptain,
      };
    }),
  getAllTeams: protectedProcedure.query(async ({ ctx }) => {
    const teams = await ctx.prisma.team.findMany({
      include: {
        captain: true,
        division: true,
        players: {
          select: {
            soldFor: true,
            user: true,
          },
        },
      },
    });
    return teams;
  }),
  removeCaptain: protectedProcedure
    .input(
      z.object({
        captainId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const removeCaptain = await ctx.prisma.team.update({
        where: {
          captainId: input.captainId,
        },
        data: {
          captainId: null,
        },
      });
      return removeCaptain;
    }),
});
