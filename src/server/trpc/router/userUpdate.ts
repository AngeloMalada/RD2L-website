import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

//create a mutation
export const userUpdate = router({
  userUpdate: protectedProcedure
    .input(
      z.object({
        dotabuff: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          dotabuff: input.dotabuff,
        },
      });

      return user;
    }),

  placeUserInTeam: protectedProcedure
    .input(
      z.object({
        teamId: z.number(),
        userId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.signup.update({
        where: {
          id: input.userId,
        },
        data: {
          teamId: input.teamId,
        },
      });
    }),
});
