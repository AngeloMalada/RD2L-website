import { router, protectedProcedure } from '../trpc';

//create a mutation
export const seasonRouter = router({
  newSeason: protectedProcedure.mutation(async ({ ctx }) => {
    const deleteTeams = await ctx.prisma.team.deleteMany();
    const deleteSignUps = await ctx.prisma.signup.deleteMany();
    return {
      deleteTeams,
      deleteSignUps,
    };
  }),
});
