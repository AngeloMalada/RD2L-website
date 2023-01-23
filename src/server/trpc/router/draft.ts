import { z } from 'zod';

import { router, protectedProcedure } from '../trpc';

//create a mutation
export const draftRouter = router({
  updateIndex: protectedProcedure.mutation(async ({ ctx, input }) => {
    const index = await ctx.prisma.draft.findUnique({
      where: {
        id: 1,
      },
    });

    const draft = await ctx.prisma.draft.update({
      where: {
        id: 1,
      },
      data: {
        index: index ? (index.index !== 5 ? index.index + 1 : 0) : 0,
      },
    });
    return draft;
  }),
  getIndex: protectedProcedure.query(async ({ ctx }) => {
    const index = await ctx.prisma.draft.findUnique({
      where: {
        id: 1,
      },
    });
    return index;
  }),
});
