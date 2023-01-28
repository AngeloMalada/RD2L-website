import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

//create a mutation
export const draftRouter = router({
  getDrafters: protectedProcedure
    .input(
      z.object({
        division: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const drafters = await ctx.prisma.team.findMany({
        where: {
          divisionId: input.division,
        },
        select: {
          id: true,
          name: true,
          coins: true,
          drafter: {
            select: {
              user: true,
            },
          },
          players: {
            select: {
              soldFor: true,
              user: true,
            },
          },
        },
      });
      return drafters;
    }),
});
