import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';

//create a mutation
export const playerRouter = router({
  getAllPlayers: protectedProcedure.query(async ({ ctx }) => {
    const players = await ctx.prisma.user.findMany({
      orderBy: {
        banned: 'asc',
      },
    });
    return players;
  }),
  banPlayer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const player = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          banned: true,
        },
      });
      return player;
    }),
  unbanPlayer: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const player = await ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          banned: false,
        },
      });
      return player;
    }),

  removePlayerFromTeam: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const player = await ctx.prisma.signup.update({
        where: {
          id: input.id,
        },
        data: {
          teamId: null,
        },
      });
      return player;
    }),
});
