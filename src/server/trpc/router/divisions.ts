import { router, protectedProcedure } from "../trpc";

//create a mutation
export const divisionsRouter = router({
  getDivisions: protectedProcedure.query(async ({ ctx }) => {
    const divisions = await ctx.prisma.division.findMany({
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            captain: true,
            players: true,
          },
        },
      },
    });
    return divisions;
  }),
});
